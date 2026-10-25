from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import User, CustomerProfile, DealerProfile


class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a dealer user
        self.dealer_user = User.objects.create_user(
            username='dealer1',
            email='dealer@carcraft.com',
            password='DealerPassword@123',
            role=User.Role.DEALER
        )
        DealerProfile.objects.create(user=self.dealer_user, dealership_name='CarCraft Downtown')

        # Create a customer user
        self.customer_user = User.objects.create_user(
            username='customer1',
            email='customer@example.com',
            password='CustomerPassword@123',
            role=User.Role.CUSTOMER
        )
        CustomerProfile.objects.create(user=self.customer_user, city='New Delhi')

    def test_customer_registration_success(self):
        payload = {
            'username': 'newcustomer',
            'email': 'newcustomer@example.com',
            'password': 'SecurePassword@123',
            'confirm_password': 'SecurePassword@123',
            'first_name': 'New',
            'last_name': 'Customer',
            'phone': '9876543210',
            'city': 'Mumbai'
        }
        response = self.client.post(reverse('auth-register'), payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['user']['role'], 'CUSTOMER')
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])

        # Verify created in DB
        user = User.objects.get(username='newcustomer')
        self.assertEqual(user.role, User.Role.CUSTOMER)
        self.assertEqual(user.customer_profile.city, 'Mumbai')

    def test_customer_registration_mismatched_password(self):
        payload = {
            'username': 'failcustomer',
            'email': 'fail@example.com',
            'password': 'SecurePassword@123',
            'confirm_password': 'WrongPassword@123',
        }
        response = self.client.post(reverse('auth-register'), payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])

    def test_customer_login_with_username_and_email(self):
        # Login with username
        resp_username = self.client.post(reverse('auth-login'), {
            'login': 'customer1',
            'password': 'CustomerPassword@123'
        }, format='json')
        self.assertEqual(resp_username.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', resp_username.data)

        # Login with email
        resp_email = self.client.post(reverse('auth-login'), {
            'login': 'customer@example.com',
            'password': 'CustomerPassword@123'
        }, format='json')
        self.assertEqual(resp_email.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_email.data['user']['username'], 'customer1')

    def test_dealer_login_allowed_for_dealer(self):
        response = self.client.post(reverse('auth-dealer-login'), {
            'login': 'dealer1',
            'password': 'DealerPassword@123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['user']['role'], 'DEALER')

    def test_dealer_login_rejected_for_customer(self):
        response = self.client.post(reverse('auth-dealer-login'), {
            'login': 'customer1',
            'password': 'CustomerPassword@123'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(response.data['success'])

    def test_current_user_me_endpoint(self):
        # Login customer to get access token
        login_resp = self.client.post(reverse('auth-login'), {
            'login': 'customer1',
            'password': 'CustomerPassword@123'
        }, format='json')
        token = login_resp.data['tokens']['access']

        # Without token -> 401 Unauthorized
        unauth_resp = self.client.get(reverse('auth-me'))
        self.assertEqual(unauth_resp.status_code, status.HTTP_401_UNAUTHORIZED)

        # With Bearer token -> 200 OK
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        auth_resp = self.client.get(reverse('auth-me'))
        self.assertEqual(auth_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(auth_resp.data['user']['username'], 'customer1')

    def test_current_user_profile_update(self):
        login_resp = self.client.post(reverse('auth-login'), {
            'login': 'customer1',
            'password': 'CustomerPassword@123'
        }, format='json')
        token = login_resp.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        patch_resp = self.client.patch(reverse('auth-me'), {
            'phone': '1122334455',
            'city': 'Bangalore'
        }, format='json')
        self.assertEqual(patch_resp.status_code, status.HTTP_200_OK)
        self.customer_user.refresh_from_db()
        self.assertEqual(self.customer_user.phone, '1122334455')
        self.assertEqual(self.customer_user.customer_profile.city, 'Bangalore')

    def test_token_refresh(self):
        login_resp = self.client.post(reverse('auth-login'), {
            'login': 'customer1',
            'password': 'CustomerPassword@123'
        }, format='json')
        refresh_token = login_resp.data['tokens']['refresh']

        refresh_resp = self.client.post(reverse('token-refresh'), {
            'refresh': refresh_token
        }, format='json')
        self.assertEqual(refresh_resp.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_resp.data)


import time
import pyotp
from datetime import timedelta
from django.utils import timezone
from django.core.management import call_command
from io import StringIO
from .models import AdminTOTPDevice, RecoveryCode, AdminLoginChallenge
from .totp_utils import (
    generate_totp_secret,
    encrypt_secret,
    decrypt_secret,
    generate_recovery_codes,
    hash_recovery_code,
    hash_challenge_token,
)


class AdminMFATests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create dealer admin user
        self.admin = User.objects.create_user(
            username='atelier_admin',
            email='admin@carcraft.internal',
            password='AdminPassword@2026',
            role=User.Role.DEALER
        )
        DealerProfile.objects.create(user=self.admin, dealership_name='CarCraft Atelier')

        # Create customer user
        self.customer = User.objects.create_user(
            username='vip_client',
            email='client@example.com',
            password='ClientPassword@123',
            role=User.Role.CUSTOMER
        )
        CustomerProfile.objects.create(user=self.customer, city='New Delhi')

        # Generate a deterministic secret and TOTP helper for testing
        self.totp_secret = generate_totp_secret()
        self.totp = pyotp.TOTP(self.totp_secret, interval=30, digits=6)

    def _enroll_admin_mfa(self):
        """Helper to fully enroll and enable MFA on self.admin"""
        device, _ = AdminTOTPDevice.objects.get_or_create(user=self.admin)
        device.encrypted_secret = encrypt_secret(self.totp_secret)
        device.encrypted_pending_secret = None
        device.is_enabled = True
        device.enrolled_at = timezone.now()
        device.last_verified_step = 0
        device.save()

        # Add sample recovery code
        self.raw_recovery_code = 'TEST-CODE-RECV'
        RecoveryCode.objects.create(
            device=device,
            code_hash=hash_recovery_code(self.raw_recovery_code)
        )
        return device

    def test_invalid_admin_credentials_does_not_start_session(self):
        resp = self.client.post(reverse('auth-dealer-login'), {
            'login': 'atelier_admin',
            'password': 'WrongPassword@999'
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(resp.data['success'])
        self.assertNotIn('tokens', resp.data)
        self.assertNotIn('challenge_token', resp.data)

    def test_unregistered_username_generic_error(self):
        resp = self.client.post(reverse('auth-dealer-login'), {
            'login': 'nonexistent_user',
            'password': 'SomePassword@123'
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(resp.data['success'])

    def test_customer_cannot_access_dealer_login(self):
        resp = self.client.post(reverse('auth-dealer-login'), {
            'login': 'vip_client',
            'password': 'ClientPassword@123'
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(resp.data['success'])

    def test_admin_safe_bootstrap_when_mfa_not_enrolled(self):
        """Admins without MFA enrolled receive normal tokens so they are never locked out."""
        resp = self.client.post(reverse('auth-dealer-login'), {
            'login': 'atelier_admin',
            'password': 'AdminPassword@2026'
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(resp.data['success'])
        self.assertFalse(resp.data.get('mfa_required', True))
        self.assertIn('tokens', resp.data)
        self.assertIn('access', resp.data['tokens'])

    def test_admin_mfa_setup_requires_password_reauthentication(self):
        # Authenticate admin
        login_resp = self.client.post(reverse('auth-dealer-login'), {
            'login': 'atelier_admin',
            'password': 'AdminPassword@2026'
        }, format='json')
        token = login_resp.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Setup without password fails with clear validation response
        resp_no_pwd = self.client.post(reverse('auth-dealer-mfa-setup'), {}, format='json')
        self.assertEqual(resp_no_pwd.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(resp_no_pwd.data['success'])
        self.assertIn('password', resp_no_pwd.data['errors'])

        # Setup with wrong password fails without generating secret
        resp_wrong_pwd = self.client.post(reverse('auth-dealer-mfa-setup'), {
            'password': 'WrongPassword@000'
        }, format='json')
        self.assertEqual(resp_wrong_pwd.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(resp_wrong_pwd.data['success'])
        self.assertNotIn('secret', resp_wrong_pwd.data)

        # Setup with correct password succeeds
        resp_ok = self.client.post(reverse('auth-dealer-mfa-setup'), {
            'password': 'AdminPassword@2026'
        }, format='json')
        self.assertEqual(resp_ok.status_code, status.HTTP_200_OK)
        self.assertTrue(resp_ok.data['success'])
        self.assertIn('secret', resp_ok.data)
        self.assertIn('qr_code', resp_ok.data)
        self.assertIn('provisioning_uri', resp_ok.data)

        # Verify device is still pending, not enabled yet!
        device = AdminTOTPDevice.objects.get(user=self.admin)
        self.assertFalse(device.is_enabled)
        self.assertIsNotNone(device.encrypted_pending_secret)

    def test_admin_mfa_setup_with_current_password_alias_succeeds(self):
        """Verify that current_password field name is supported alongside password."""
        login_resp = self.client.post(reverse('auth-dealer-login'), {
            'login': 'atelier_admin',
            'password': 'AdminPassword@2026'
        }, format='json')
        token = login_resp.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        resp_alias = self.client.post(reverse('auth-dealer-mfa-setup'), {
            'current_password': 'AdminPassword@2026'
        }, format='json')
        self.assertEqual(resp_alias.status_code, status.HTTP_200_OK)
        self.assertTrue(resp_alias.data['success'])
        self.assertIn('secret', resp_alias.data)

    def test_admin_mfa_setup_unauthenticated_request_rejected(self):
        """Unauthenticated requests must be rejected with 401."""
        self.client.credentials()  # Remove any credentials
        resp = self.client.post(reverse('auth-dealer-mfa-setup'), {
            'password': 'AdminPassword@2026'
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_mfa_setup_customer_account_rejected(self):
        """Authenticated customer token without dealer permissions must receive 403 Forbidden."""
        login_resp = self.client.post(reverse('auth-login'), {
            'login': 'vip_client',
            'password': 'ClientPassword@123'
        }, format='json')
        customer_token = login_resp.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {customer_token}')

        resp = self.client.post(reverse('auth-dealer-mfa-setup'), {
            'password': 'ClientPassword@123'
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_mfa_setup_wrong_account_password_rejected(self):
        """Authenticated dealer cannot verify password belonging to a different user."""
        # Create a second dealer user
        dealer2 = User.objects.create_user(
            username='dealer2_other',
            email='dealer2@carcraft.internal',
            password='Dealer2Password@999',
            role=User.Role.DEALER
        )
        DealerProfile.objects.create(user=dealer2, dealership_name='CarCraft Second')

        # Authenticate as dealer1 (atelier_admin)
        login_resp = self.client.post(reverse('auth-dealer-login'), {
            'login': 'atelier_admin',
            'password': 'AdminPassword@2026'
        }, format='json')
        token = login_resp.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Attempt to verify using dealer2's password
        resp = self.client.post(reverse('auth-dealer-mfa-setup'), {
            'password': 'Dealer2Password@999'
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(resp.data['success'])


    def test_admin_mfa_confirm_with_valid_totp_enables_mfa(self):
        login_resp = self.client.post(reverse('auth-dealer-login'), {
            'login': 'atelier_admin',
            'password': 'AdminPassword@2026'
        }, format='json')
        token = login_resp.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Initiate setup
        setup_resp = self.client.post(reverse('auth-dealer-mfa-setup'), {
            'password': 'AdminPassword@2026'
        }, format='json')
        secret = setup_resp.data['secret']

        # Confirm with invalid TOTP code fails
        fail_confirm = self.client.post(reverse('auth-dealer-mfa-confirm'), {
            'code': '000000'
        }, format='json')
        self.assertEqual(fail_confirm.status_code, status.HTTP_400_BAD_REQUEST)

        # Confirm with valid TOTP code succeeds
        totp = pyotp.TOTP(secret, interval=30, digits=6)
        valid_code = totp.now()
        confirm_resp = self.client.post(reverse('auth-dealer-mfa-confirm'), {
            'code': valid_code
        }, format='json')
        self.assertEqual(confirm_resp.status_code, status.HTTP_200_OK)
        self.assertTrue(confirm_resp.data['success'])
        self.assertTrue(confirm_resp.data['is_mfa_enabled'])
        self.assertEqual(len(confirm_resp.data['recovery_codes']), 8)

        # Verify DB state
        device = AdminTOTPDevice.objects.get(user=self.admin)
        self.assertTrue(device.is_enabled)
        self.assertIsNone(device.encrypted_pending_secret)
        self.assertEqual(device.recovery_codes.count(), 8)

    def test_valid_admin_credentials_produce_mfa_challenge_not_jwt(self):
        """When MFA is enabled, Step 1 returns an MFA challenge and NO tokens."""
        self._enroll_admin_mfa()

        resp = self.client.post(reverse('auth-dealer-login'), {
            'login': 'atelier_admin',
            'password': 'AdminPassword@2026'
        }, format='json')

        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(resp.data['success'])
        self.assertTrue(resp.data['mfa_required'])
        self.assertIn('challenge_token', resp.data)
        # MUST NEVER issue JWT before Step 2!
        self.assertNotIn('tokens', resp.data)

        # Check DB challenge created
        token = resp.data['challenge_token']
        token_hash = hash_challenge_token(token)
        self.assertTrue(AdminLoginChallenge.objects.filter(token_hash=token_hash).exists())

    def test_correct_authenticator_otp_grants_admin_access(self):
        self._enroll_admin_mfa()

        # Step 1: Login to get challenge
        step1_resp = self.client.post(reverse('auth-dealer-login'), {
            'login': 'atelier_admin',
            'password': 'AdminPassword@2026'
        }, format='json')
        challenge_token = step1_resp.data['challenge_token']

        # Step 2: Verify valid OTP
        valid_code = self.totp.now()
        step2_resp = self.client.post(reverse('auth-dealer-mfa-verify'), {
            'challenge_token': challenge_token,
            'code': valid_code
        }, format='json')

        self.assertEqual(step2_resp.status_code, status.HTTP_200_OK)
        self.assertTrue(step2_resp.data['success'])
        self.assertIn('tokens', step2_resp.data)
        self.assertIn('access', step2_resp.data['tokens'])
        self.assertIn('refresh', step2_resp.data['tokens'])
        self.assertEqual(step2_resp.data['user']['username'], 'atelier_admin')

    def test_incorrect_otp_does_not_grant_access(self):
        self._enroll_admin_mfa()

        step1_resp = self.client.post(reverse('auth-dealer-login'), {
            'login': 'atelier_admin',
            'password': 'AdminPassword@2026'
        }, format='json')
        challenge_token = step1_resp.data['challenge_token']

        step2_resp = self.client.post(reverse('auth-dealer-mfa-verify'), {
            'challenge_token': challenge_token,
            'code': '999999'
        }, format='json')

        self.assertEqual(step2_resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(step2_resp.data['success'])
        self.assertNotIn('tokens', step2_resp.data)

    def test_expired_challenge_is_rejected(self):
        self._enroll_admin_mfa()

        step1_resp = self.client.post(reverse('auth-dealer-login'), {
            'login': 'atelier_admin',
            'password': 'AdminPassword@2026'
        }, format='json')
        challenge_token = step1_resp.data['challenge_token']

        # Artificially expire challenge in DB
        challenge = AdminLoginChallenge.objects.get(user=self.admin)
        challenge.expires_at = timezone.now() - timedelta(minutes=10)
        challenge.save()

        step2_resp = self.client.post(reverse('auth-dealer-mfa-verify'), {
            'challenge_token': challenge_token,
            'code': self.totp.now()
        }, format='json')

        self.assertEqual(step2_resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('expired', step2_resp.data['message'].lower())

    def test_reused_challenge_is_rejected(self):
        self._enroll_admin_mfa()

        step1_resp = self.client.post(reverse('auth-dealer-login'), {
            'login': 'atelier_admin',
            'password': 'AdminPassword@2026'
        }, format='json')
        challenge_token = step1_resp.data['challenge_token']

        # First use succeeds
        step2_resp = self.client.post(reverse('auth-dealer-mfa-verify'), {
            'challenge_token': challenge_token,
            'code': self.totp.now()
        }, format='json')
        self.assertEqual(step2_resp.status_code, status.HTTP_200_OK)

        # Second use of same challenge MUST fail!
        step2_reused = self.client.post(reverse('auth-dealer-mfa-verify'), {
            'challenge_token': challenge_token,
            'code': self.totp.now()
        }, format='json')
        self.assertEqual(step2_reused.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('consumed', step2_reused.data['message'].lower())

    def test_replayed_totp_timestep_is_rejected(self):
        device = self._enroll_admin_mfa()

        # Step 1: Login 1
        step1_resp1 = self.client.post(reverse('auth-dealer-login'), {
            'login': 'atelier_admin',
            'password': 'AdminPassword@2026'
        }, format='json')
        challenge_token1 = step1_resp1.data['challenge_token']

        code = self.totp.now()

        # Verify challenge 1
        resp1 = self.client.post(reverse('auth-dealer-mfa-verify'), {
            'challenge_token': challenge_token1,
            'code': code
        }, format='json')
        self.assertEqual(resp1.status_code, status.HTTP_200_OK)

        # Step 1: Login 2 (produces fresh challenge)
        step1_resp2 = self.client.post(reverse('auth-dealer-login'), {
            'login': 'atelier_admin',
            'password': 'AdminPassword@2026'
        }, format='json')
        challenge_token2 = step1_resp2.data['challenge_token']

        # Replay the exact same code for the same time step
        resp2 = self.client.post(reverse('auth-dealer-mfa-verify'), {
            'challenge_token': challenge_token2,
            'code': code
        }, format='json')
        # Replay protection must reject it!
        self.assertEqual(resp2.status_code, status.HTTP_400_BAD_REQUEST)

    def test_excessive_attempts_rate_limited(self):
        self._enroll_admin_mfa()

        step1_resp = self.client.post(reverse('auth-dealer-login'), {
            'login': 'atelier_admin',
            'password': 'AdminPassword@2026'
        }, format='json')
        challenge_token = step1_resp.data['challenge_token']

        # 5 failed attempts
        for _ in range(5):
            self.client.post(reverse('auth-dealer-mfa-verify'), {
                'challenge_token': challenge_token,
                'code': '123456'
            }, format='json')

        # 6th attempt should be rejected due to challenge lockout
        locked_resp = self.client.post(reverse('auth-dealer-mfa-verify'), {
            'challenge_token': challenge_token,
            'code': self.totp.now()
        }, format='json')
        self.assertEqual(locked_resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('locked', locked_resp.data['message'].lower())

    def test_recovery_code_works_once_and_cannot_be_reused(self):
        self._enroll_admin_mfa()

        # Step 1: Login
        step1_resp = self.client.post(reverse('auth-dealer-login'), {
            'login': 'atelier_admin',
            'password': 'AdminPassword@2026'
        }, format='json')
        challenge_token = step1_resp.data['challenge_token']

        # Step 2: Use recovery code
        rec_resp = self.client.post(reverse('auth-dealer-mfa-verify'), {
            'challenge_token': challenge_token,
            'code': self.raw_recovery_code
        }, format='json')
        self.assertEqual(rec_resp.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', rec_resp.data)

        # Check DB that recovery code is marked used
        rec_code = RecoveryCode.objects.get(device__user=self.admin)
        self.assertTrue(rec_code.is_used)

        # Second login trying to reuse the same recovery code must fail
        step1_resp2 = self.client.post(reverse('auth-dealer-login'), {
            'login': 'atelier_admin',
            'password': 'AdminPassword@2026'
        }, format='json')
        challenge_token2 = step1_resp2.data['challenge_token']

        rec_reuse_resp = self.client.post(reverse('auth-dealer-mfa-verify'), {
            'challenge_token': challenge_token2,
            'code': self.raw_recovery_code
        }, format='json')
        self.assertEqual(rec_reuse_resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_legacy_customer_login_cannot_bypass_admin_mfa(self):
        """Admin with MFA enabled cannot use customer login to bypass MFA."""
        self._enroll_admin_mfa()

        resp = self.client.post(reverse('auth-login'), {
            'login': 'atelier_admin',
            'password': 'AdminPassword@2026'
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertNotIn('tokens', resp.data)

    def test_customers_cannot_enroll_or_access_admin_mfa_endpoints(self):
        # Authenticate customer
        login_resp = self.client.post(reverse('auth-login'), {
            'login': 'vip_client',
            'password': 'ClientPassword@123'
        }, format='json')
        cust_token = login_resp.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {cust_token}')

        # Customer attempts setup -> 403 Forbidden
        setup_resp = self.client.post(reverse('auth-dealer-mfa-setup'), {
            'password': 'ClientPassword@123'
        }, format='json')
        self.assertEqual(setup_resp.status_code, status.HTTP_403_FORBIDDEN)

        # Customer attempts status -> 403 Forbidden
        status_resp = self.client.get(reverse('auth-dealer-mfa-status'))
        self.assertEqual(status_resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_enabled_mfa_secret_never_returned_by_ordinary_apis(self):
        device = self._enroll_admin_mfa()

        # Login and verify
        s1 = self.client.post(reverse('auth-dealer-login'), {
            'login': 'atelier_admin',
            'password': 'AdminPassword@2026'
        }, format='json')
        s2 = self.client.post(reverse('auth-dealer-mfa-verify'), {
            'challenge_token': s1.data['challenge_token'],
            'code': self.totp.now()
        }, format='json')
        token = s2.data['tokens']['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Query /me
        me_resp = self.client.get(reverse('auth-me'))
        self.assertEqual(me_resp.status_code, status.HTTP_200_OK)
        raw_content = str(me_resp.data)
        self.assertNotIn(self.totp_secret, raw_content)
        self.assertNotIn('encrypted_secret', raw_content)

        # Query /dealer/mfa/status
        status_resp = self.client.get(reverse('auth-dealer-mfa-status'))
        self.assertEqual(status_resp.status_code, status.HTTP_200_OK)
        self.assertNotIn(self.totp_secret, str(status_resp.data))

    def test_reset_admin_mfa_management_command(self):
        self._enroll_admin_mfa()
        device = AdminTOTPDevice.objects.get(user=self.admin)
        self.assertTrue(device.is_enabled)

        out = StringIO()
        call_command('reset_admin_mfa', username='atelier_admin', stdout=out)
        self.assertIn('Successfully reset', out.getvalue())

        device.refresh_from_db()
        self.assertFalse(device.is_enabled)
        self.assertIsNone(device.encrypted_secret)

