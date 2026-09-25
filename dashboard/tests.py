from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse


class AuthenticationWorkflowTests(TestCase):
	def setUp(self):
		self.user = get_user_model().objects.create_user(
			username='workflow-user',
			password='test-password-123',
		)

	def test_login_with_valid_password(self):
		response = self.client.post(reverse('login'), {
			'username': self.user.username,
			'password': 'test-password-123',
		})

		self.assertRedirects(response, reverse('dashboard:home'))
		self.assertIn('_auth_user_id', self.client.session)

	def test_login_rejects_wrong_password(self):
		response = self.client.post(reverse('login'), {
			'username': self.user.username,
			'password': 'incorrect-password',
		})

		self.assertEqual(response.status_code, 200)
		self.assertTrue(response.context['form'].errors)
		self.assertNotIn('_auth_user_id', self.client.session)

	def test_logout_ends_authenticated_session(self):
		self.client.force_login(self.user)

		response = self.client.post(reverse('logout'))

		self.assertRedirects(response, reverse('login'))
		self.assertNotIn('_auth_user_id', self.client.session)
