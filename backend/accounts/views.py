"""
CarCraft Accounts API Views.

Endpoints:
  POST /api/auth/register/                    - Customer registration
  POST /api/auth/login/                       - Customer / non-MFA dealer login
  POST /api/auth/dealer/login/                - Dealer login (step 1 of 2FA)
  POST /api/auth/dealer/mfa/verify/           - MFA step-up (step 2 of 2FA)
  GET  /api/auth/me/                          - Authenticated user profile
  PATCH /api/auth/me/                         - Update own profile
  POST /api/auth/token/refresh/               - JWT token refresh

  GET  /api/auth/dealer/mfa/status/           - 2FA status for authenticated dealer
  POST /api/auth/dealer/mfa/setup/            - Initiate 2FA enrollment (requires password)
  POST /api/auth/dealer/mfa/confirm/          - Confirm 2FA enrollment with TOTP code
  POST /api/auth/dealer/mfa/disable/          - Disable 2FA (requires password + TOTP)
  POST /api/auth/dealer/mfa/recovery-codes/regenerate/ - Regenerate recovery codes
"""

from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView

from .models import AdminLoginChallenge, AdminTOTPDevice, RecoveryCode, User
from .permissions import IsDealer
from .serializers import (
    AdminMFAConfirmSerializer,
    AdminMFADisableSerializer,
    AdminMFARecoveryRegenerateSerializer,
    AdminMFASetupSerializer,
    AdminMFAVerifySerializer,
    DealerLoginSerializer,
    LoginSerializer,
    UserProfileUpdateSerializer,
    UserRegistrationSerializer,
    UserSerializer,
)
from .totp_utils import (
    decrypt_secret,
    encrypt_secret,
    generate_qr_code_base64,
    generate_recovery_codes,
    generate_totp_secret,
    get_provisioning_uri,
    hash_challenge_token,
    hash_recovery_code,
    verify_recovery_code,
    verify_totp,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_client_ip(request):
    xfwd = request.META.get('HTTP_X_FORWARDED_FOR')
    if xfwd:
        return xfwd.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


def _build_user_tokens(user):
    """Issue a JWT access + refresh pair with custom claims."""
    refresh = RefreshToken.for_user(user)
    refresh['role'] = user.role
    refresh['username'] = user.username
    refresh['email'] = user.email
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }


def _serialize_user(user):
    return UserSerializer(user).data


# ---------------------------------------------------------------------------
# Customer Registration
# ---------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """POST /api/auth/register/ — Public customer self-registration."""
    serializer = UserRegistrationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()
    tokens = _build_user_tokens(user)

    return Response({
        'success': True,
        'message': 'Account created successfully.',
        'user': _serialize_user(user),
        'tokens': tokens,
    }, status=status.HTTP_201_CREATED)


# ---------------------------------------------------------------------------
# Customer / Generic Login
# ---------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """POST /api/auth/login/ — Customer and non-MFA dealer login."""
    serializer = LoginSerializer(data=request.data, context={'request': request})
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    user = data['user']

    return Response({
        'success': True,
        'message': 'Login successful.',
        'user': _serialize_user(user),
        'tokens': {
            'access': data['access'],
            'refresh': data['refresh'],
        },
    }, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Dealer Login (Step 1 of 2)
# ---------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def dealer_login(request):
    """
    POST /api/auth/dealer/login/
    Step 1: Authenticate username/password for DEALER accounts.
    If MFA is enrolled and active, returns a short-lived challenge token
    instead of final JWT tokens (mfa_required=True).
    """
    from django.contrib.auth import authenticate as django_authenticate
    login_field = request.data.get('login', '') or request.data.get('username', '') or request.data.get('email', '')
    password = request.data.get('password', '')

    # Resolve user by username or email
    auth_user = None
    if login_field and '@' in login_field:
        try:
            u = User.objects.get(email__iexact=login_field)
            auth_user = django_authenticate(username=u.username, password=password)
        except User.DoesNotExist:
            auth_user = None
    elif login_field:
        auth_user = django_authenticate(username=login_field, password=password)

    if auth_user and auth_user.is_active and not auth_user.is_dealer:
        # Valid user but not a dealer — return 403 Forbidden
        return Response({'success': False, 'message': 'Access denied. Only authorized dealer accounts are permitted.'}, status=status.HTTP_403_FORBIDDEN)

    serializer = DealerLoginSerializer(data=request.data, context={'request': request})
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    user = data['user']

    if data.get('mfa_required'):
        return Response({
            'success': True,
            'mfa_required': True,
            'challenge_token': data['challenge_token'],
            'expires_in': data.get('expires_in', 300),
            'message': 'Two-factor authentication required. Enter your TOTP code.',
        }, status=status.HTTP_200_OK)

    # Safe bootstrap: 2FA not yet enrolled
    return Response({
        'success': True,
        'mfa_required': False,
        'mfa_enrolled': False,
        'message': 'Login successful. Please configure Two-Factor Authentication to enhance security.',
        'user': _serialize_user(user),
        'tokens': {
            'access': data['access'],
            'refresh': data['refresh'],
        },
    }, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# MFA Verify (Step 2 of 2)
# ---------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([AllowAny])
def dealer_mfa_verify(request):
    """
    POST /api/auth/dealer/mfa/verify/
    Step 2: Submit TOTP code or recovery code together with the challenge_token.
    Returns final JWT tokens on success.
    """
    serializer = AdminMFAVerifySerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    raw_token = serializer.validated_data['challenge_token']
    code = serializer.validated_data['code'].strip()
    token_hash = hash_challenge_token(raw_token)

    # Look up challenge
    try:
        challenge = AdminLoginChallenge.objects.select_related('user__totp_device').get(
            token_hash=token_hash,
            purpose='dealer_mfa_login',
        )
    except AdminLoginChallenge.DoesNotExist:
        return Response({'success': False, 'errors': {'detail': 'Invalid or expired challenge token.'}},
                        status=status.HTTP_400_BAD_REQUEST)

    # Guard: challenge already consumed (reused)
    if challenge.is_used:
        return Response({'success': False, 'message': 'This challenge token has already been consumed. Please sign in again.'},
                        status=status.HTTP_400_BAD_REQUEST)

    # Guard: challenge validity (expired)
    if timezone.now() >= challenge.expires_at:
        return Response({'success': False, 'message': 'Challenge token has expired. Please sign in again.'},
                        status=status.HTTP_400_BAD_REQUEST)

    # Guard: per-challenge rate limit (max 5 failed attempts)
    if challenge.failed_attempts >= 5:
        challenge.is_used = True
        challenge.save(update_fields=['is_used'])
        return Response({'success': False, 'message': 'Too many failed attempts. Account temporarily locked. Please sign in again.'},
                        status=status.HTTP_400_BAD_REQUEST)

    user = challenge.user

    # Ensure user has an enabled TOTP device
    try:
        device = user.totp_device
        if not device.is_enabled:
            return Response({'success': False, 'errors': {'detail': 'MFA device not enrolled.'}},
                            status=status.HTTP_400_BAD_REQUEST)
    except AdminTOTPDevice.DoesNotExist:
        return Response({'success': False, 'errors': {'detail': 'MFA device not found.'}},
                        status=status.HTTP_400_BAD_REQUEST)

    # Device lockout check
    if device.is_locked():
        return Response({'success': False, 'errors': {'detail': 'TOTP device is temporarily locked due to excessive failed attempts.'}},
                        status=status.HTTP_429_TOO_MANY_REQUESTS)

    # --- Try TOTP code first ---
    clean_code = code.replace(' ', '').replace('-', '').upper()
    is_totp_format = len(clean_code) == 6 and clean_code.isdigit()

    verified = False

    if is_totp_format:
        secret = decrypt_secret(device.encrypted_secret)
        is_valid, verified_step = verify_totp(secret, code, last_verified_step=device.last_verified_step)
        if is_valid:
            device.last_verified_step = verified_step
            device.clear_failed_attempts()
            device.save(update_fields=['last_verified_step'])
            verified = True
    
    # --- Try recovery code if TOTP failed or it's a recovery code format ---
    if not verified:
        unused_codes = RecoveryCode.objects.filter(device=device, is_used=False)
        for rc in unused_codes:
            if verify_recovery_code(code, rc.code_hash):
                rc.is_used = True
                rc.used_at = timezone.now()
                rc.save(update_fields=['is_used', 'used_at'])
                device.clear_failed_attempts()
                verified = True
                break

    if not verified:
        # Record failed attempt on both challenge and device
        challenge.failed_attempts += 1
        challenge.save(update_fields=['failed_attempts'])
        device.record_failed_attempt()
        return Response({'success': False, 'errors': {'code': ['Invalid verification code. Please check your authenticator application.']}},
                        status=status.HTTP_400_BAD_REQUEST)

    # Mark challenge as consumed
    challenge.is_used = True
    challenge.save(update_fields=['is_used'])

    tokens = _build_user_tokens(user)
    return Response({
        'success': True,
        'message': 'Two-factor authentication verified successfully.',
        'user': _serialize_user(user),
        'tokens': tokens,
    }, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Authenticated User Profile
# ---------------------------------------------------------------------------

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """GET/PATCH /api/auth/me/ — View or update authenticated user profile."""
    user = request.user
    if request.method == 'GET':
        return Response({'success': True, 'user': _serialize_user(user)}, status=status.HTTP_200_OK)

    serializer = UserProfileUpdateSerializer(user, data=request.data, partial=True)
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    serializer.save()
    return Response({'success': True, 'user': _serialize_user(user)}, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Dealer MFA — Status
# ---------------------------------------------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsDealer])
def dealer_mfa_status(request):
    """GET /api/auth/dealer/mfa/status/ — Return current 2FA enrollment state."""
    user = request.user
    try:
        device = user.totp_device
        remaining = device.recovery_codes.filter(is_used=False).count() if device.is_enabled else 0
        return Response({
            'success': True,
            'is_mfa_enabled': device.is_enabled,
            'enrolled_at': device.enrolled_at.isoformat() if device.enrolled_at else None,
            'recovery_codes_remaining': remaining,
        })
    except AdminTOTPDevice.DoesNotExist:
        return Response({
            'success': True,
            'is_mfa_enabled': False,
            'enrolled_at': None,
            'recovery_codes_remaining': 0,
        })


# ---------------------------------------------------------------------------
# Dealer MFA — Setup (Initiate Enrollment)
# ---------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsDealer])
def dealer_mfa_setup(request):
    """
    POST /api/auth/dealer/mfa/setup/
    Reauthenticate with password, generate a pending TOTP secret and QR code.
    The secret is stored as 'pending' until the admin confirms with a valid TOTP code.
    """
    serializer = AdminMFASetupSerializer(data=request.data, context={'request': request})
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    user = request.user
    secret = generate_totp_secret()
    provisioning_uri = get_provisioning_uri(user.username, secret, issuer='CarCraft Admin')
    qr_code_b64 = generate_qr_code_base64(provisioning_uri)

    # Store encrypted pending secret
    device, _ = AdminTOTPDevice.objects.get_or_create(user=user)
    device.encrypted_pending_secret = encrypt_secret(secret)
    device.save(update_fields=['encrypted_pending_secret'])

    return Response({
        'success': True,
        'secret': secret,
        'provisioning_uri': provisioning_uri,
        'qr_code': qr_code_b64,
    }, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Dealer MFA — Confirm Enrollment
# ---------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsDealer])
def dealer_mfa_confirm(request):
    """
    POST /api/auth/dealer/mfa/confirm/
    Verify the first TOTP code against the pending secret to complete enrollment.
    Generates and returns 8 one-time recovery codes.
    """
    serializer = AdminMFAConfirmSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    code = serializer.validated_data['code'].strip()
    user = request.user

    try:
        device = user.totp_device
    except AdminTOTPDevice.DoesNotExist:
        return Response({'success': False, 'errors': {'detail': 'No pending MFA setup found. Please initiate setup first.'}},
                        status=status.HTTP_400_BAD_REQUEST)

    if not device.encrypted_pending_secret:
        return Response({'success': False, 'errors': {'detail': 'No pending MFA setup found. Please initiate setup first.'}},
                        status=status.HTTP_400_BAD_REQUEST)

    pending_secret = decrypt_secret(device.encrypted_pending_secret)
    is_valid, verified_step = verify_totp(pending_secret, code)

    if not is_valid:
        return Response({'success': False, 'errors': {'code': ['Invalid verification code. Please check your authenticator application.']}},
                        status=status.HTTP_400_BAD_REQUEST)

    # Activate the device
    device.encrypted_secret = encrypt_secret(pending_secret)
    device.encrypted_pending_secret = None
    device.is_enabled = True
    device.enrolled_at = timezone.now()
    device.last_verified_step = verified_step
    device.failed_verify_attempts = 0
    device.locked_until = None
    device.save()

    # Generate and store hashed recovery codes
    plain_codes = generate_recovery_codes(count=8)
    RecoveryCode.objects.filter(device=device).delete()  # Remove any old codes
    RecoveryCode.objects.bulk_create([
        RecoveryCode(device=device, code_hash=hash_recovery_code(c))
        for c in plain_codes
    ])

    return Response({
        'success': True,
        'is_mfa_enabled': True,
        'message': 'Two-Factor Authentication has been successfully enabled.',
        'recovery_codes': plain_codes,
    }, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Dealer MFA — Disable
# ---------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsDealer])
def dealer_mfa_disable(request):
    """
    POST /api/auth/dealer/mfa/disable/
    Disable 2FA after verifying current password and a valid TOTP or recovery code.
    """
    serializer = AdminMFADisableSerializer(data=request.data, context={'request': request})
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    code = serializer.validated_data['code'].strip()
    user = request.user

    try:
        device = user.totp_device
        if not device.is_enabled:
            return Response({'success': False, 'errors': {'detail': 'MFA is not currently enabled.'}},
                            status=status.HTTP_400_BAD_REQUEST)
    except AdminTOTPDevice.DoesNotExist:
        return Response({'success': False, 'errors': {'detail': 'No MFA device found.'}},
                        status=status.HTTP_400_BAD_REQUEST)

    # Verify TOTP or recovery code
    verified = False
    if len(code.replace(' ', '').replace('-', '')) == 6 and code.replace(' ', '').replace('-', '').isdigit():
        secret = decrypt_secret(device.encrypted_secret)
        is_valid, _ = verify_totp(secret, code, last_verified_step=device.last_verified_step)
        if is_valid:
            verified = True

    if not verified:
        unused_codes = RecoveryCode.objects.filter(device=device, is_used=False)
        for rc in unused_codes:
            if verify_recovery_code(code, rc.code_hash):
                rc.is_used = True
                rc.used_at = timezone.now()
                rc.save(update_fields=['is_used', 'used_at'])
                verified = True
                break

    if not verified:
        return Response({'success': False, 'errors': {'code': ['Invalid verification code.']}},
                        status=status.HTTP_400_BAD_REQUEST)

    # Disable the device
    device.is_enabled = False
    device.encrypted_secret = None
    device.encrypted_pending_secret = None
    device.enrolled_at = None
    device.last_verified_step = 0
    device.failed_verify_attempts = 0
    device.locked_until = None
    device.save()

    # Remove recovery codes
    RecoveryCode.objects.filter(device=device).delete()

    return Response({
        'success': True,
        'message': 'Two-Factor Authentication has been disabled.',
    }, status=status.HTTP_200_OK)


# ---------------------------------------------------------------------------
# Dealer MFA — Regenerate Recovery Codes
# ---------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsDealer])
def dealer_mfa_regenerate_recovery_codes(request):
    """
    POST /api/auth/dealer/mfa/recovery-codes/regenerate/
    Invalidate all existing recovery codes and generate a new set.
    Requires current password and valid TOTP code.
    """
    serializer = AdminMFARecoveryRegenerateSerializer(data=request.data, context={'request': request})
    if not serializer.is_valid():
        return Response({'success': False, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    code = serializer.validated_data['code'].strip()
    user = request.user

    try:
        device = user.totp_device
        if not device.is_enabled:
            return Response({'success': False, 'errors': {'detail': 'MFA is not enabled.'}},
                            status=status.HTTP_400_BAD_REQUEST)
    except AdminTOTPDevice.DoesNotExist:
        return Response({'success': False, 'errors': {'detail': 'No MFA device found.'}},
                        status=status.HTTP_400_BAD_REQUEST)

    secret = decrypt_secret(device.encrypted_secret)
    is_valid, _ = verify_totp(secret, code, last_verified_step=device.last_verified_step)
    if not is_valid:
        return Response({'success': False, 'errors': {'code': ['Invalid TOTP code.']}},
                        status=status.HTTP_400_BAD_REQUEST)

    plain_codes = generate_recovery_codes(count=8)
    RecoveryCode.objects.filter(device=device).delete()
    RecoveryCode.objects.bulk_create([
        RecoveryCode(device=device, code_hash=hash_recovery_code(c))
        for c in plain_codes
    ])

    return Response({
        'success': True,
        'message': 'Recovery codes have been regenerated.',
        'recovery_codes': plain_codes,
    }, status=status.HTTP_200_OK)
