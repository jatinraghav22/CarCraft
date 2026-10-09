from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Vehicle


class VehicleCataloguePermissionTests(APITestCase):
	def test_guest_can_browse_but_cannot_manage_vehicles(self):
		response = self.client.get('/api/vehicles/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)

		response = self.client.post('/api/vehicles/', {
			'brand': 'Guest', 'model': 'Unauthorized', 'year': 2026, 'price': '1000.00',
		}, format='json')
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_dealer_can_manage_vehicles_and_access_dealer_counts(self):
		dealer = get_user_model().objects.create_user(
			username='vehicle-dealer', email='vehicle-dealer@example.com',
			password='Dealer123!', role='DEALER',
		)
		access_token = RefreshToken.for_user(dealer).access_token
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
		response = self.client.post('/api/vehicles/', {
			'brand': 'CarCraft', 'model': 'Dealer GT', 'year': 2026, 'price': '1000.00',
		}, format='json')
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(Vehicle.objects.filter(model='Dealer GT').exists())

		response = self.client.get('/api/dealer/counts/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
