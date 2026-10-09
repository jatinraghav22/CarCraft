from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from parts.models import Part
from .models import Cart, CartItem, Order, Wishlist, WishlistItem


class CustomerOrderAndCartApiTests(APITestCase):
	def setUp(self):
		user_model = get_user_model()
		self.customer = user_model.objects.create_user(
			username='customer-one', email='one@example.com', password='Customer123!'
		)
		self.other_customer = user_model.objects.create_user(
			username='customer-two', email='two@example.com', password='Customer123!'
		)
		self.dealer = user_model.objects.create_user(
			username='dealer-one', email='dealer@example.com', password='Dealer123!', role='DEALER'
		)
		self.part = Part.objects.create(
			name='Brake Kit', sku='TEST-BRAKE-01', brand='CarCraft',
			selling_price='1200.00', stock_quantity=5,
		)

	def authenticate_as(self, user):
		access_token = RefreshToken.for_user(user).access_token
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')

	def test_guest_can_browse_catalogues(self):
		self.assertEqual(self.client.get('/api/vehicles/').status_code, status.HTTP_200_OK)
		self.assertEqual(self.client.get('/api/parts/').status_code, status.HTTP_200_OK)

	def test_guest_and_invalid_jwt_cannot_mutate_customer_resources(self):
		cart = Cart.objects.create(user=self.customer)
		cart_item = CartItem.objects.create(cart=cart, part=self.part, quantity=1)
		wishlist = Wishlist.objects.create(user=self.customer)
		wishlist_item = WishlistItem.objects.create(wishlist=wishlist, part=self.part)
		guest_requests = [
			('post', '/api/cart/add/', {'part_id': self.part.id, 'quantity': 1}),
			('patch', f'/api/cart/item/{cart_item.id}/', {'quantity': 2}),
			('delete', f'/api/cart/item/{cart_item.id}/', None),
			('post', '/api/cart/clear/', {}),
			('post', '/api/wishlist/', {'part_id': self.part.id}),
			('delete', f'/api/wishlist/item/{wishlist_item.id}/', None),
			('post', '/api/orders/checkout/', {'shipping_address': 'Example'}),
			('post', '/api/orders/', {}),
			('get', '/api/orders/', None),
			('get', '/api/auth/me/', None),
		]
		for method, url, data in guest_requests:
			response = getattr(self.client, method)(url, data, format='json') if data is not None else getattr(self.client, method)(url)
			self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED, url)

		self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid-token')
		for url, data in [
			('/api/cart/add/', {'part_id': self.part.id}),
			('/api/wishlist/', {'part_id': self.part.id}),
			('/api/orders/checkout/', {'shipping_address': 'Example'}),
		]:
			response = self.client.post(url, data, format='json')
			self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED, url)

	def test_customer_can_add_to_cart_wishlist_and_checkout(self):
		self.authenticate_as(self.customer)
		cart_response = self.client.post(
			'/api/cart/add/', {'part_id': self.part.id, 'quantity': 1}, format='json'
		)
		self.assertEqual(cart_response.status_code, status.HTTP_200_OK)
		cart_item_id = cart_response.data['cart']['items'][0]['id']
		quantity_response = self.client.patch(
			f'/api/cart/item/{cart_item_id}/', {'quantity': 2}, format='json'
		)
		self.assertEqual(quantity_response.status_code, status.HTTP_200_OK)
		self.assertEqual(quantity_response.data['cart']['items'][0]['quantity'], 2)

		wishlist_response = self.client.post(
			'/api/wishlist/', {'part_id': self.part.id}, format='json'
		)
		self.assertEqual(wishlist_response.status_code, status.HTTP_201_CREATED)
		wishlist_item_id = wishlist_response.data['item']['id']
		remove_response = self.client.delete(f'/api/wishlist/item/{wishlist_item_id}/')
		self.assertEqual(remove_response.status_code, status.HTTP_200_OK)

		checkout_response = self.client.post('/api/orders/checkout/', {
			'shipping_address': '10 Example Street',
			'shipping_city': 'Mumbai',
			'shipping_state': 'MH',
			'shipping_postal_code': '400001',
			'payment_method': 'CARD',
		}, format='json')
		self.assertEqual(checkout_response.status_code, status.HTTP_201_CREATED)
		order_id = checkout_response.data['order']['id']
		self.assertEqual(Order.objects.get(id=order_id).customer, self.customer)

		self.authenticate_as(self.other_customer)
		self.assertEqual(self.client.get(f'/api/orders/{order_id}/').status_code, status.HTTP_404_NOT_FOUND)

	def test_customer_cannot_write_generic_orders_but_dealer_can(self):
		self.authenticate_as(self.customer)
		response = self.client.post('/api/orders/', {}, format='json')
		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

		self.authenticate_as(self.dealer)
		response = self.client.post('/api/orders/', {
			'shipping_address': 'Dealer test record',
		}, format='json')
		self.assertNotEqual(response.status_code, status.HTTP_403_FORBIDDEN)
