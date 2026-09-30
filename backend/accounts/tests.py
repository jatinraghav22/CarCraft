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
