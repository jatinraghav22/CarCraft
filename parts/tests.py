from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import Part, PartOrder


class PartsWorkflowTests(TestCase):
	def setUp(self):
		user = get_user_model().objects.create_user(
			username='parts-user',
			password='test-password-123',
		)
		self.client.force_login(user)

	def part_data(self, **overrides):
		data = {
			'name': 'Brake Pad Set',
			'sku': 'BRAKE-TEST-1',
			'category': 'Brakes',
			'price': '42.50',
			'stock_qty': '20',
		}
		data.update(overrides)
		return data

	def test_part_can_be_added_and_stock_updated(self):
		response = self.client.post(reverse('part_add'), self.part_data())
		self.assertRedirects(response, reverse('part_list'))
		part = Part.objects.get()

		response = self.client.post(
			reverse('part_edit', args=[part.pk]),
			self.part_data(stock_qty='24'),
		)
		self.assertRedirects(response, reverse('part_list'))
		part.refresh_from_db()
		self.assertEqual(part.stock_qty, 24)

	def test_order_decreases_stock_and_records_order(self):
		part = Part.objects.create(
			name='Brake Pad Set',
			sku='BRAKE-TEST-2',
			category='Brakes',
			price='42.50',
			stock_qty=20,
		)

		response = self.client.post(
			reverse('part_order', args=[part.pk]),
			{'quantity': '2'},
		)

		self.assertRedirects(
			response,
			reverse('part_detail', args=[part.pk]),
		)
		part.refresh_from_db()
		order = PartOrder.objects.get(part=part)
		self.assertEqual(part.stock_qty, 18)
		self.assertEqual(order.quantity, 2)
		self.assertEqual(order.total, 85)

	def test_order_cannot_exceed_stock_or_use_invalid_quantity(self):
		part = Part.objects.create(
			name='Oil Filter',
			sku='FILTER-TEST-1',
			category='Filters',
			price='10.00',
			stock_qty=1,
		)

		response = self.client.post(
			reverse('part_order', args=[part.pk]),
			{'quantity': '2'},
		)
		self.assertEqual(response.status_code, 200)
		self.assertIn('quantity', response.context['form'].errors)
		part.refresh_from_db()
		self.assertEqual(part.stock_qty, 1)
		self.assertFalse(PartOrder.objects.exists())

		response = self.client.post(
			reverse('part_order', args=[part.pk]),
			{'quantity': 'not-a-number'},
		)
		self.assertEqual(response.status_code, 200)
		self.assertIn('quantity', response.context['form'].errors)
		self.assertFalse(PartOrder.objects.exists())
