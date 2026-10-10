from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from vehicles.models import Vehicle
from .models import ServiceAppointment, TestDrive


class CustomerBookingApiTests(APITestCase):
	def setUp(self):
		user_model = get_user_model()
		self.customer = user_model.objects.create_user(
			username='booking-customer', email='booking@example.com', password='Customer123!'
		)
		self.other_customer = user_model.objects.create_user(
			username='other-customer', email='other@example.com', password='Customer123!'
		)
		self.vehicle = Vehicle.objects.create(
			brand='CarCraft', model='Test GT', year=2026, price='125000.00'
		)

	def authenticate_as(self, user):
		access_token = RefreshToken.for_user(user).access_token
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

	def test_guest_cannot_book_services_or_test_drives(self):
		service_response = self.client.post('/api/service-appointments/', {
			'vehicle': self.vehicle.id,
			'service_type': 'Full Inspection',
			'preferred_date': '2026-11-01',
			'preferred_time': '10:00:00',
		}, format='json')
		test_drive_response = self.client.post('/api/test-drives/', {
			'vehicle': self.vehicle.id,
			'preferred_date': '2026-11-01',
			'preferred_time': '10:00:00',
			'phone': '5550100',
		}, format='json')
		self.assertEqual(service_response.status_code, status.HTTP_401_UNAUTHORIZED)
		self.assertEqual(test_drive_response.status_code, status.HTTP_401_UNAUTHORIZED)
		self.assertEqual(ServiceAppointment.objects.count(), 0)

		self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid-token')
		for url, payload in [
			('/api/service-appointments/', {
				'vehicle': self.vehicle.id,
				'service_type': 'Full Inspection',
				'preferred_date': '2026-11-01',
				'preferred_time': '10:00:00',
			}),
			('/api/test-drives/', {
				'vehicle': self.vehicle.id,
				'preferred_date': '2026-11-01',
				'preferred_time': '10:00:00',
				'phone': '5550100',
			}),
		]:
			response = self.client.post(url, payload, format='json')
			self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED, url)

	def test_customer_can_book_and_only_access_own_records(self):
		self.authenticate_as(self.customer)
		service_response = self.client.post('/api/service-appointments/', {
			'customer': self.other_customer.id,
			'vehicle': self.vehicle.id,
			'service_type': 'Full Inspection',
			'preferred_date': '2026-11-01',
			'preferred_time': '10:00:00',
		}, format='json')
		test_drive_response = self.client.post('/api/test-drives/', {
			'vehicle': self.vehicle.id,
			'preferred_date': '2026-11-01',
			'preferred_time': '11:00:00',
			'phone': '5550100',
		}, format='json')
		self.assertEqual(service_response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(test_drive_response.status_code, status.HTTP_201_CREATED)

		service_id = service_response.data['id']
		test_drive_id = test_drive_response.data['id']
		self.authenticate_as(self.other_customer)
		self.assertEqual(
			self.client.get(f'/api/service-appointments/{service_id}/').status_code,
			status.HTTP_404_NOT_FOUND,
		)
		self.assertEqual(
			self.client.get(f'/api/test-drives/{test_drive_id}/').status_code,
			status.HTTP_404_NOT_FOUND,
		)

		self.assertEqual(ServiceAppointment.objects.get(id=service_id).customer, self.customer)
		self.assertEqual(TestDrive.objects.get(id=test_drive_id).customer, self.customer)
