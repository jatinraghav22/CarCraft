from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from customers.models import Customer
from inventory.models import Vehicle
from sales.models import Sale
from service.models import ServiceAppointment


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


class DashboardActivityTests(TestCase):
	def test_dashboard_lists_recent_sales_and_upcoming_services(self):
		customer = Customer.objects.create(
			full_name='Dashboard Customer',
			email='dashboard@example.com',
			phone='4155550100',
			address='Dashboard address',
		)
		vehicle = Vehicle.objects.create(
			make='Toyota',
			model='Camry',
			year=2025,
			vin='DASHBOARD00000001',
			color='White',
			price='25000.00',
		)
		sale = Sale.objects.create(
			customer=customer,
			vehicle=vehicle,
			amount='25000.00',
			stage='sold',
		)
		upcoming = ServiceAppointment.objects.create(
			customer=customer,
			vehicle=vehicle,
			scheduled_for=timezone.now() + timedelta(days=2),
			description='Scheduled maintenance',
			status='scheduled',
		)
		ServiceAppointment.objects.create(
			customer=customer,
			vehicle=vehicle,
			scheduled_for=timezone.now() + timedelta(days=3),
			description='Completed service',
			status='completed',
		)

		response = self.client.get(reverse('dashboard:home'))

		self.assertEqual(list(response.context['recent_sales']), [sale])
		self.assertEqual(list(response.context['upcoming_services']), [upcoming])
		self.assertEqual(response.context['open_services'], 1)
