from datetime import timedelta
from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, AdminTOTPDevice, RecoveryCode, AdminLoginChallenge
from .permissions import IsDealer
from .totp_utils import (
    encrypt_secret,
    decrypt_secret,
    generate_totp_secret,
    get_provisioning_uri,
    generate_qr_code_base64,
    verify_totp,
    generate_recovery_codes,
    hash_recovery_code,
    verify_recovery_code,
    hash_challenge_token,
)
from .serializers import (
    UserRegistrationSerializer,
    LoginSerializer,
    DealerLoginSerializer,
    UserSerializer,
    UserProfileUpdateSerializer,
    AdminMFAVerifySerializer,
    AdminMFASetupSerializer,
    AdminMFAConfirmSerializer,
    AdminMFADisableSerializer,
    AdminMFARecoveryRegenerateSerializer,
)


@api_view(['GET'])
@permission_classes([AllowAny])
def auth_root(request):
    """
    Overview of all authentication endpoints with clickable links.
    """
    return Response({
        'service': 'CarCraft Authentication Service',
        'endpoints': {
            'register': request.build_absolute_uri('register/'),
            'login': request.build_absolute_uri('login/'),
            'dealer_login': request.build_absolute_uri('dealer/login/'),
            'dealer_mfa_verify': request.build_absolute_uri('dealer/mfa/verify/'),
            'dealer_mfa_setup': request.build_absolute_uri('dealer/mfa/setup/'),
            'dealer_mfa_confirm': request.build_absolute_uri('dealer/mfa/confirm/'),
            'dealer_mfa_status': request.build_absolute_uri('dealer/mfa/status/'),
            'dealer_mfa_disable': request.build_absolute_uri('dealer/mfa/disable/'),
            'dealer_mfa_recovery_regenerate': request.build_absolute_uri('dealer/mfa/recovery-codes/regenerate/'),
            'token_refresh': request.build_absolute_uri('token/refresh/'),
            'me': request.build_absolute_uri('me/'),
        }
    })



class CustomerRegisterView(APIView):
    """
    Public customer registration endpoint.
    Registration is strictly constrained to the CUSTOMER role.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            'action': 'Customer Registration',
            'method': 'POST',
            'required_fields': {
                'username': 'string (unique username)',
                'email': 'string (valid email address)',
                'password': 'string (secure password)',
                'confirm_password': 'string (must match password)',
            },
            'optional_fields': {
                'first_name': 'string',
                'last_name': 'string',
                'phone': 'string',
                'address': 'string',
                'city': 'string',
                'state': 'string',
                'postal_code': 'string',
            },
            'note': 'Dealer accounts cannot be registered publicly.'
        })

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Auto-generate JWT tokens for immediate login
            refresh = RefreshToken.for_user(user)
            refresh['role'] = user.role
            refresh['username'] = user.username
            refresh['email'] = user.email

            return Response({
                'success': True,
                'message': 'Customer registered successfully.',
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_201_CREATED)

        return Response({
            'success': False,
            'message': 'Registration validation failed.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class CustomerLoginView(APIView):
    """
    Customer & standard user login endpoint.
    Accepts username or email along with password.
    Returns JWT access and refresh tokens.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            'action': 'Customer Login',
            'method': 'POST',
            'required_fields': {
                'login': 'string (your username OR email address)',
                'password': 'string (your password)'
            }
        })

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            user = data['user']
            return Response({
                'success': True,
                'message': 'Login successful.',
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': data['access'],
                    'refresh': data['refresh'],
                }
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Authentication failed.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class DealerLoginView(APIView):
    """
    Private Dealer/Admin login endpoint.
    Strictly verifies credentials and that the account possesses the DEALER role.
    If 2FA is enabled, issues a single-use login challenge instead of tokens.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            'action': 'Private Dealer/Admin Portal Login',
            'method': 'POST',
            'required_fields': {
                'login': 'string (dealer username or email, e.g. "admin")',
                'password': 'string (e.g. "admin123")'
            },
            'note': 'Customer accounts are blocked from this endpoint with 403 Forbidden.'
        })

    def post(self, request):
        serializer = DealerLoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            data = serializer.validated_data
            user = data['user']

            if data.get('mfa_required'):
                # Admin has 2FA enabled: return short-lived challenge without tokens
                return Response({
                    'success': True,
                    'mfa_required': True,
                    'message': 'Two-factor authentication required. Please enter the code from your authenticator app.',
                    'challenge_token': data['challenge_token'],
                    'expires_in': data['expires_in'],
                }, status=status.HTTP_200_OK)

            # Safe bootstrap: Admin has not enrolled in 2FA yet
            return Response({
                'success': True,
                'mfa_required': False,
                'mfa_enrolled': False,
                'message': 'Dealer login successful. Two-factor authentication setup is recommended.',
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': data['access'],
                    'refresh': data['refresh'],
                }
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Dealer authentication failed.',
            'errors': serializer.errors
        }, status=status.HTTP_403_FORBIDDEN if 'Only authorized dealer' in str(serializer.errors) else status.HTTP_400_BAD_REQUEST)


class DealerMFAVerifyView(APIView):
    """
    Verify Authenticator TOTP or recovery code for an active login challenge.
    Only after successful verification are final JWT access and refresh tokens issued.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminMFAVerifySerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Validation failed.',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        challenge_token = serializer.validated_data['challenge_token']
        raw_code = serializer.validated_data['code'].strip()
        token_hash = hash_challenge_token(challenge_token)

        with transaction.atomic():
            challenge = (
                AdminLoginChallenge.objects
                .select_for_update()
                .filter(token_hash=token_hash, purpose='dealer_mfa_login')
                .first()
            )

            if not challenge:
                return Response({
                    'success': False,
                    'message': 'Invalid login challenge. Please log in again.'
                }, status=status.HTTP_400_BAD_REQUEST)

            if challenge.is_used:
                return Response({
                    'success': False,
                    'message': 'This login challenge has already been consumed. Please log in again.'
                }, status=status.HTTP_400_BAD_REQUEST)

            if timezone.now() > challenge.expires_at:
                return Response({
                    'success': False,
                    'message': 'Login challenge has expired. Please log in again.'
                }, status=status.HTTP_400_BAD_REQUEST)

            if challenge.failed_attempts >= 5:
                return Response({
                    'success': False,
                    'message': 'Excessive failed verification attempts. Challenge has been locked.'
                }, status=status.HTTP_400_BAD_REQUEST)

            user = challenge.user
            if not user.is_active or not user.is_dealer:
                return Response({
                    'success': False,
                    'message': 'Access denied.'
                }, status=status.HTTP_403_FORBIDDEN)

            device = (
                AdminTOTPDevice.objects
                .select_for_update()
                .filter(user=user)
                .first()
            )

            if not device or not device.is_enabled or not device.encrypted_secret:
                return Response({
                    'success': False,
                    'message': 'Two-factor authentication is not configured for this account.'
                }, status=status.HTTP_400_BAD_REQUEST)

            if device.locked_until and timezone.now() < device.locked_until:
                return Response({
                    'success': False,
                    'message': 'Account temporarily locked due to excessive failed attempts. Please try again later.'
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)

            is_verified = False
            verified_step = 0
            is_recovery_used = False

            # 1. Attempt TOTP verification if code looks like a 6-digit TOTP
            clean_code = raw_code.replace(" ", "")
            if len(clean_code) == 6 and clean_code.isdigit():
                secret = decrypt_secret(device.encrypted_secret)
                is_totp_ok, step = verify_totp(
                    secret,
                    clean_code,
                    last_verified_step=device.last_verified_step
                )
                if is_totp_ok:
                    is_verified = True
                    verified_step = step

            # 2. If TOTP verification failed, attempt Recovery Code check
            if not is_verified:
                active_recovery_codes = (
                    RecoveryCode.objects
                    .select_for_update()
                    .filter(device=device, is_used=False)
                )
                matched_recovery = None
                for rec_code in active_recovery_codes:
                    if verify_recovery_code(raw_code, rec_code.code_hash):
                        matched_recovery = rec_code
                        break

                if matched_recovery:
                    is_verified = True
                    is_recovery_used = True
                    matched_recovery.is_used = True
                    matched_recovery.used_at = timezone.now()
                    matched_recovery.save(update_fields=['is_used', 'used_at'])

            if not is_verified:
                challenge.failed_attempts += 1
                challenge.save(update_fields=['failed_attempts'])

                device.failed_verify_attempts += 1
                device.last_failed_attempt_at = timezone.now()
                if device.failed_verify_attempts >= 5:
                    device.locked_until = timezone.now() + timedelta(minutes=5)
                device.save(update_fields=['failed_verify_attempts', 'last_failed_attempt_at', 'locked_until'])

                return Response({
                    'success': False,
                    'message': 'Invalid verification code or recovery code. Please try again.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Verification successful!
            # Atomically consume challenge
            challenge.is_used = True
            challenge.save(update_fields=['is_used'])

            # If TOTP used, update time step to prevent replay attacks
            if not is_recovery_used:
                device.last_verified_step = verified_step

            # Reset lockout / failure counters
            device.failed_verify_attempts = 0
            device.locked_until = None
            device.save(update_fields=['last_verified_step', 'failed_verify_attempts', 'locked_until'])

            # Issue final JWT tokens
            refresh = RefreshToken.for_user(user)
            refresh['role'] = user.role
            refresh['username'] = user.username
            refresh['email'] = user.email

            return Response({
                'success': True,
                'message': 'Two-factor authentication successful.',
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_200_OK)


class DealerMFASetupView(APIView):
    """
    Initiate Authenticator App TOTP setup.
    Requires password reauthentication.
    Generates a secure random TOTP secret, provisioning URI, and QR code data URI.
    Stores pending secret separately from enabled secret.
    """
    permission_classes = [IsAuthenticated, IsDealer]

    def post(self, request):
        serializer = AdminMFASetupSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Authentication failed.',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        secret_base32 = generate_totp_secret()
        encrypted_pending = encrypt_secret(secret_base32)
        provisioning_uri = get_provisioning_uri(user.username, secret_base32, issuer="CarCraft Admin")
        qr_code_base64 = generate_qr_code_base64(provisioning_uri)

        with transaction.atomic():
            device, _ = AdminTOTPDevice.objects.get_or_create(user=user)
            device.encrypted_pending_secret = encrypted_pending
            device.save(update_fields=['encrypted_pending_secret', 'updated_at'])

        return Response({
            'success': True,
            'message': 'Two-factor enrollment initiated. Scan the QR code or enter the setup key manually, then confirm with a 6-digit code.',
            'secret': secret_base32,
            'provisioning_uri': provisioning_uri,
            'qr_code': qr_code_base64,
            'issuer': 'CarCraft Admin',
            'username': user.username,
        }, status=status.HTTP_200_OK)


class DealerMFAConfirmView(APIView):
    """
    Confirm pending TOTP setup by providing a valid code from the authenticator app.
    On success, enables MFA, promotes pending secret, generates recovery codes, and returns them once.
    """
    permission_classes = [IsAuthenticated, IsDealer]

    def post(self, request):
        serializer = AdminMFAConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Validation failed.',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        code = serializer.validated_data['code'].strip()
        user = request.user

        with transaction.atomic():
            device = (
                AdminTOTPDevice.objects
                .select_for_update()
                .filter(user=user)
                .first()
            )

            if not device or not device.encrypted_pending_secret:
                return Response({
                    'success': False,
                    'message': 'No pending MFA enrollment found. Please start setup again.'
                }, status=status.HTTP_400_BAD_REQUEST)

            pending_secret = decrypt_secret(device.encrypted_pending_secret)
            is_valid, step = verify_totp(pending_secret, code)

            if not is_valid:
                return Response({
                    'success': False,
                    'message': 'Invalid verification code. Please check your authenticator app and try again.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Promote pending secret to active enabled secret
            device.encrypted_secret = device.encrypted_pending_secret
            device.encrypted_pending_secret = None
            device.is_enabled = True
            device.enrolled_at = timezone.now()
            device.last_verified_step = step
            device.failed_verify_attempts = 0
            device.locked_until = None
            device.save()

            # Generate 8 high-entropy single-use recovery codes
            raw_codes = generate_recovery_codes(count=8)
            device.recovery_codes.all().delete()
            for rec in raw_codes:
                RecoveryCode.objects.create(
                    device=device,
                    code_hash=hash_recovery_code(rec)
                )

        return Response({
            'success': True,
            'message': 'Two-factor authentication successfully enabled.',
            'recovery_codes': raw_codes,
            'is_mfa_enabled': True,
        }, status=status.HTTP_200_OK)


class DealerMFAStatusView(APIView):
    """
    Returns current MFA enrollment status and count of unused recovery codes for the authenticated Admin.
    Does NOT leak any secrets or sensitive keys.
    """
    permission_classes = [IsAuthenticated, IsDealer]

    def get(self, request):
        user = request.user
        device = getattr(user, 'totp_device', None)

        if device and device.is_enabled:
            unused_recovery_count = device.recovery_codes.filter(is_used=False).count()
            return Response({
                'success': True,
                'is_mfa_enabled': True,
                'enrolled_at': device.enrolled_at,
                'recovery_codes_remaining': unused_recovery_count,
            }, status=status.HTTP_200_OK)

        return Response({
            'success': True,
            'is_mfa_enabled': False,
            'enrolled_at': None,
            'recovery_codes_remaining': 0,
        }, status=status.HTTP_200_OK)


class DealerMFADisableView(APIView):
    """
    Disables Two-Factor Authentication for the authenticated Admin.
    Requires password reauthentication and a valid current code/recovery code.
    """
    permission_classes = [IsAuthenticated, IsDealer]

    def post(self, request):
        serializer = AdminMFADisableSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Validation failed.',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        raw_code = serializer.validated_data['code'].strip()
        user = request.user

        with transaction.atomic():
            device = (
                AdminTOTPDevice.objects
                .select_for_update()
                .filter(user=user)
                .first()
            )

            if not device or not device.is_enabled or not device.encrypted_secret:
                return Response({
                    'success': False,
                    'message': 'Two-factor authentication is not currently enabled.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Verify code
            is_valid = False
            clean_code = raw_code.replace(" ", "")
            if len(clean_code) == 6 and clean_code.isdigit():
                secret = decrypt_secret(device.encrypted_secret)
                is_valid, _ = verify_totp(secret, clean_code, last_verified_step=device.last_verified_step)

            if not is_valid:
                # Try recovery code
                rec_obj = (
                    RecoveryCode.objects
                    .select_for_update()
                    .filter(device=device, is_used=False)
                )
                for rec in rec_obj:
                    if verify_recovery_code(raw_code, rec.code_hash):
                        is_valid = True
                        break

            if not is_valid:
                return Response({
                    'success': False,
                    'message': 'Invalid verification code or recovery code.'
                }, status=status.HTTP_400_BAD_REQUEST)

            device.is_enabled = False
            device.encrypted_secret = None
            device.encrypted_pending_secret = None
            device.recovery_codes.all().delete()
            device.save()

        return Response({
            'success': True,
            'message': 'Two-factor authentication has been successfully disabled.',
            'is_mfa_enabled': False,
        }, status=status.HTTP_200_OK)


class DealerMFARecoveryRegenerateView(APIView):
    """
    Regenerates fresh recovery codes for an enabled MFA device.
    Invalidates all prior recovery codes.
    Requires password reauthentication and current valid TOTP code.
    """
    permission_classes = [IsAuthenticated, IsDealer]

    def post(self, request):
        serializer = AdminMFARecoveryRegenerateSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Validation failed.',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        raw_code = serializer.validated_data['code'].strip()
        user = request.user

        with transaction.atomic():
            device = (
                AdminTOTPDevice.objects
                .select_for_update()
                .filter(user=user)
                .first()
            )

            if not device or not device.is_enabled or not device.encrypted_secret:
                return Response({
                    'success': False,
                    'message': 'Two-factor authentication is not currently enabled.'
                }, status=status.HTTP_400_BAD_REQUEST)

            secret = decrypt_secret(device.encrypted_secret)
            is_valid, step = verify_totp(secret, raw_code, last_verified_step=device.last_verified_step)
            if not is_valid:
                return Response({
                    'success': False,
                    'message': 'Invalid authenticator code.'
                }, status=status.HTTP_400_BAD_REQUEST)

            device.last_verified_step = step
            device.save(update_fields=['last_verified_step'])

            raw_codes = generate_recovery_codes(count=8)
            device.recovery_codes.all().delete()
            for rec in raw_codes:
                RecoveryCode.objects.create(
                    device=device,
                    code_hash=hash_recovery_code(rec)
                )

        return Response({
            'success': True,
            'message': 'New recovery codes generated successfully. Store them safely.',
            'recovery_codes': raw_codes,
        }, status=status.HTTP_200_OK)




class CurrentUserView(APIView):
    """
    Profile endpoint for the currently authenticated user.
    Requires a valid JWT Bearer token.
    Supports GET (view profile) and PATCH (update profile).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({
            'success': True,
            'user': serializer.data
        }, status=status.HTTP_200_OK)

    def patch(self, request):
        serializer = UserProfileUpdateSerializer(
            instance=request.user,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            updated_user = serializer.save()
            return Response({
                'success': True,
                'message': 'Profile updated successfully.',
                'user': UserSerializer(updated_user).data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'message': 'Profile update validation failed.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
