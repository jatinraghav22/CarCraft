from django.test import TestCase
from django.urls import reverse

from customers.models import Customer
from inventory.models import Vehicle

from .models import ServiceAppointment


class ServiceWorkflowTests(TestCase):
	def setUp(self):
		self.customer = Customer.objects.create(
			full_name='Service Customer',
			email='service@example.com',
			phone='1234567890',
			address='Service address',
		)
		self.vehicle = Vehicle.objects.create(
			make='Honda',
			model='Civic',
			year=2024,
			vin='SERVICE0000000001',
			color='Silver',
			price='12000.00',
		)

	def appointment_data(self, status='scheduled', cost='0.00'):
		return {
			'customer': self.customer.pk,
			'vehicle': self.vehicle.pk,
			'scheduled_for': '2026-10-01T09:30',
			'description': 'Routine inspection',
			'status': status,
			'cost': cost,
		}

	def test_appointment_moves_through_workflow_and_records_cost(self):
		response = self.client.post(
			reverse('service_add'),
			self.appointment_data(),
		)

		self.assertRedirects(response, reverse('service_list'))
		appointment = ServiceAppointment.objects.get()
		self.assertEqual(appointment.status, 'scheduled')
		self.assertEqual(appointment.vehicle, self.vehicle)

		response = self.client.post(
			reverse('service_edit', args=[appointment.pk]),
			self.appointment_data(status='in_progress'),
		)
		self.assertRedirects(response, reverse('service_list'))

		response = self.client.post(
			reverse('service_edit', args=[appointment.pk]),
			self.appointment_data(status='completed', cost='425.50'),
		)

		self.assertRedirects(response, reverse('service_list'))
		appointment.refresh_from_db()
		self.assertEqual(appointment.status, 'completed')
		self.assertEqual(str(appointment.cost), '425.50')

	def test_service_requires_vehicle_and_nonnegative_cost(self):
		missing_vehicle = self.appointment_data()
		missing_vehicle['vehicle'] = ''
		response = self.client.post(reverse('service_add'), missing_vehicle)
		self.assertEqual(response.status_code, 200)
		self.assertIn('vehicle', response.context['form'].errors)

		negative_cost = self.appointment_data(cost='-1.00')
		response = self.client.post(reverse('service_add'), negative_cost)
		self.assertEqual(response.status_code, 200)
		self.assertIn('cost', response.context['form'].errors)
		self.assertFalse(ServiceAppointment.objects.exists())

	def test_new_appointment_must_start_scheduled(self):
		response = self.client.post(
			reverse('service_add'),
			self.appointment_data(status='in_progress'),
		)

		self.assertEqual(response.status_code, 200)
		self.assertIn('status', response.context['form'].errors)
		self.assertFalse(ServiceAppointment.objects.exists())

	def test_appointment_cannot_skip_or_reverse_statuses(self):
		self.client.post(reverse('service_add'), self.appointment_data())
		appointment = ServiceAppointment.objects.get()

		skipped = self.appointment_data(status='completed', cost='50.00')
		response = self.client.post(
			reverse('service_edit', args=[appointment.pk]),
			skipped,
		)
		self.assertEqual(response.status_code, 200)
		self.assertIn('status', response.context['form'].errors)

		self.client.post(
			reverse('service_edit', args=[appointment.pk]),
			self.appointment_data(status='in_progress'),
		)
		response = self.client.post(
			reverse('service_edit', args=[appointment.pk]),
			self.appointment_data(status='scheduled'),
		)

		self.assertEqual(response.status_code, 200)
		self.assertIn('status', response.context['form'].errors)
		appointment.refresh_from_db()
		self.assertEqual(appointment.status, 'in_progress')

	def test_dashboard_counts_only_open_appointments(self):
		for status in ('scheduled', 'in_progress', 'completed'):
			ServiceAppointment.objects.create(
				customer=self.customer,
				vehicle=self.vehicle,
				scheduled_for='2026-10-01T09:30+05:30',
				description='Routine inspection',
				status=status,
				cost='0.00',
			)

		response = self.client.get(reverse('dashboard:home'))

		self.assertEqual(response.context['open_services'], 2)
