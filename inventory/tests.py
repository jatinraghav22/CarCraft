from datetime import date

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import Vehicle


class InventoryWorkflowTests(TestCase):
	def setUp(self):
		user = get_user_model().objects.create_user(
			username='inventory-user',
			password='test-password-123',
		)
		self.client.force_login(user)

	def vehicle_data(self, **overrides):
		data = {
			'make': 'Toyota',
			'model': 'Corolla',
			'year': date.today().year,
			'vin': 'INVTEST0000000001',
			'color': 'Blue',
			'price': '15000.00',
			'mileage': '100',
			'status': 'available',
		}
		data.update(overrides)
		return data

	def test_vehicle_can_be_added_edited_deleted_and_searched(self):
		response = self.client.post(
			reverse('vehicle_add'),
			self.vehicle_data(),
		)
		self.assertRedirects(response, reverse('vehicle_list'))
		vehicle = Vehicle.objects.get()

		response = self.client.get(reverse('vehicle_list'), {'q': vehicle.vin})
		self.assertEqual(response.status_code, 200)
		self.assertEqual(list(response.context['vehicles']), [vehicle])

		response = self.client.post(
			reverse('vehicle_edit', args=[vehicle.pk]),
			self.vehicle_data(make='Honda', status='reserved'),
		)
		self.assertRedirects(response, reverse('vehicle_list'))
		vehicle.refresh_from_db()
		self.assertEqual(vehicle.make, 'Honda')
		self.assertEqual(vehicle.status, 'reserved')

		response = self.client.post(reverse('vehicle_delete', args=[vehicle.pk]))
		self.assertRedirects(response, reverse('vehicle_list'))
		self.assertFalse(Vehicle.objects.exists())
