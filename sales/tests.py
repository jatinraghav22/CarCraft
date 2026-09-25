from django.test import TestCase
from django.urls import reverse

from customers.models import Customer
from inventory.models import Vehicle

from .models import Sale


class SaleVehicleLifecycleTests(TestCase):
	def setUp(self):
		self.customer = Customer.objects.create(
			full_name='Test Customer',
			email='test@example.com',
			phone='1234567890',
			address='Test address',
		)
		self.vehicle = Vehicle.objects.create(
			make='Toyota',
			model='Corolla',
			year=2025,
			vin='TESTVIN0000000001',
			color='Blue',
			price='1500000.00',
		)

	def sale_data(self, stage):
		return {
			'customer': self.customer.pk,
			'vehicle': self.vehicle.pk,
			'amount': '1500000.00',
			'stage': stage,
		}

	def test_stages_update_vehicle_status_in_order(self):
		response = self.client.post(
			reverse('sale_add'),
			self.sale_data('booking'),
		)

		self.assertRedirects(response, reverse('sale_list'))
		sale = Sale.objects.get()
		self.vehicle.refresh_from_db()
		self.assertEqual(self.vehicle.status, 'reserved')

		response = self.client.post(
			reverse('sale_edit', args=[sale.pk]),
			self.sale_data('sold'),
		)

		self.assertRedirects(response, reverse('sale_list'))
		sale.refresh_from_db()
		self.vehicle.refresh_from_db()
		self.assertEqual(sale.stage, 'sold')
		self.assertEqual(self.vehicle.status, 'sold')

		response = self.client.post(
			reverse('sale_edit', args=[sale.pk]),
			self.sale_data('delivered'),
		)

		self.assertRedirects(response, reverse('sale_list'))
		sale.refresh_from_db()
		self.vehicle.refresh_from_db()
		self.assertEqual(sale.stage, 'delivered')
		self.assertEqual(self.vehicle.status, 'delivered')

	def test_sale_cannot_skip_or_reverse_stages(self):
		response = self.client.post(
			reverse('sale_add'),
			self.sale_data('sold'),
		)

		self.assertEqual(response.status_code, 200)
		self.assertEqual(Sale.objects.count(), 0)
		self.vehicle.refresh_from_db()
		self.assertEqual(self.vehicle.status, 'available')

		response = self.client.post(
			reverse('sale_add'),
			self.sale_data('booking'),
		)
		sale = Sale.objects.get()
		response = self.client.post(
			reverse('sale_edit', args=[sale.pk]),
			self.sale_data('inquiry'),
		)

		self.assertEqual(response.status_code, 200)
		sale.refresh_from_db()
		self.vehicle.refresh_from_db()
		self.assertEqual(sale.stage, 'booking')
		self.assertEqual(self.vehicle.status, 'reserved')

	def test_booking_an_unavailable_vehicle_is_rejected(self):
		self.vehicle.status = 'sold'
		self.vehicle.save(update_fields=['status'])

		response = self.client.post(
			reverse('sale_add'),
			self.sale_data('booking'),
		)

		self.assertEqual(response.status_code, 200)
		self.assertEqual(Sale.objects.count(), 0)
		self.vehicle.refresh_from_db()
		self.assertEqual(self.vehicle.status, 'sold')

	def test_deleting_a_sale_releases_its_vehicle(self):
		self.client.post(reverse('sale_add'), self.sale_data('booking'))
		sale = Sale.objects.get()

		response = self.client.post(reverse('sale_delete', args=[sale.pk]))

		self.assertRedirects(response, reverse('sale_list'))
		self.assertFalse(Sale.objects.exists())
		self.vehicle.refresh_from_db()
		self.assertEqual(self.vehicle.status, 'available')
