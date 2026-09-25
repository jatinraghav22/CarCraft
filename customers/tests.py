from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import Customer


class CustomerWorkflowTests(TestCase):
	def setUp(self):
		user = get_user_model().objects.create_user(
			username='customer-user',
			password='test-password-123',
		)
		self.client.force_login(user)

	def customer_data(self, **overrides):
		data = {
			'full_name': 'Taylor Customer',
			'email': 'taylor@example.com',
			'phone': '+1 (415) 555-0132',
			'address': '10 Market Street',
		}
		data.update(overrides)
		return data

	def test_customer_can_be_added_edited_and_deleted(self):
		response = self.client.post(
			reverse('customer_add'),
			self.customer_data(),
		)
		self.assertRedirects(response, reverse('customer_list'))
		customer = Customer.objects.get()

		response = self.client.post(
			reverse('customer_edit', args=[customer.pk]),
			self.customer_data(full_name='Taylor Updated'),
		)
		self.assertRedirects(response, reverse('customer_list'))
		customer.refresh_from_db()
		self.assertEqual(customer.full_name, 'Taylor Updated')

		response = self.client.post(
			reverse('customer_delete', args=[customer.pk]),
		)
		self.assertRedirects(response, reverse('customer_list'))
		self.assertFalse(Customer.objects.exists())
