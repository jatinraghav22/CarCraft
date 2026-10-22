import io
import os
import shutil
from PIL import Image as PilImage
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Vehicle, VehicleImage


def create_test_image(name='test.jpg', size=(100, 100), color='blue', format='JPEG'):
    file_obj = io.BytesIO()
    img = PilImage.new('RGB', size, color=color)
    img.save(file_obj, format=format)
    file_obj.seek(0)
    return SimpleUploadedFile(
        name=name,
        content=file_obj.read(),
        content_type=f'image/{format.lower()}'
    )


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


class VehicleMultiImageUploadTests(APITestCase):
    def setUp(self):
        self.user_model = get_user_model()
        self.dealer = self.user_model.objects.create_user(
            username='dealer-john',
            email='dealer-john@carcraft.com',
            password='DealerPassword123!',
            role='DEALER'
        )
        self.customer = self.user_model.objects.create_user(
            username='customer-jane',
            email='customer-jane@example.com',
            password='CustomerPassword123!',
            role='CUSTOMER'
        )
        self.dealer_token = str(RefreshToken.for_user(self.dealer).access_token)
        self.customer_token = str(RefreshToken.for_user(self.customer).access_token)

    def tearDown(self):
        # Cleanup any media files generated during tests
        test_media_dir = os.path.join(settings.MEDIA_ROOT, 'vehicles')
        if os.path.exists(test_media_dir):
            shutil.rmtree(test_media_dir, ignore_errors=True)

    def auth_as_dealer(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.dealer_token}')

    def auth_as_customer(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.customer_token}')

    def test_create_vehicle_with_three_images(self):
        """1. Create a vehicle with three images in one operation."""
        self.auth_as_dealer()

        img1 = create_test_image('front.jpg', color='red')
        img2 = create_test_image('side.png', format='PNG', color='blue')
        img3 = create_test_image('rear.jpg', color='green')

        payload = {
            'brand': 'Porsche',
            'model': '911 GT3 RS',
            'year': 2026,
            'price': 25000000,
            'purchase_cost': 20000000,
            'fuel': 'Petrol',
            'transmission': 'Dual-Clutch',
            'body_type': 'Coupe',
            'images': [img1, img2, img3],
            'primary_index': 0,
        }

        response = self.client.post('/api/vehicles/', payload, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data = response.json()
        vehicle_id = data['id']
        vehicle = Vehicle.objects.get(id=vehicle_id)

        # Verify 3 images associated with this vehicle
        self.assertEqual(vehicle.gallery_images.count(), 3)
        self.assertEqual(len(data['gallery_images']), 3)

        # Verify primary image
        primary_images = vehicle.gallery_images.filter(is_primary=True)
        self.assertEqual(primary_images.count(), 1)
        self.assertTrue(bool(vehicle.image))
        self.assertIn('front', vehicle.image.name)

    def test_edit_vehicle_and_add_two_more_images(self):
        """2. Edit a vehicle and add two more images while preserving existing ones."""
        self.auth_as_dealer()

        # First create vehicle with 1 image
        img1 = create_test_image('initial.jpg', color='white')
        create_res = self.client.post('/api/vehicles/', {
            'brand': 'Ferrari',
            'model': '296 GTB',
            'year': 2025,
            'price': 35000000,
            'purchase_cost': 29000000,
            'images': [img1],
        }, format='multipart')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)
        v_id = create_res.json()['id']

        # Add 2 more images via PATCH
        img2 = create_test_image('interior.jpg', color='tan')
        img3 = create_test_image('engine.jpg', color='gray')
        patch_res = self.client.patch(f'/api/vehicles/{v_id}/', {
            'images': [img2, img3],
        }, format='multipart')
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)

        vehicle = Vehicle.objects.get(id=v_id)
        self.assertEqual(vehicle.gallery_images.count(), 3)
        self.assertEqual(len(patch_res.json()['gallery_images']), 3)

    def test_update_specs_without_uploading_images_preserves_existing(self):
        """3. Update specifications without uploading images; existing images remain."""
        self.auth_as_dealer()

        img1 = create_test_image('original.jpg')
        create_res = self.client.post('/api/vehicles/', {
            'brand': 'BMW',
            'model': 'M5 CS',
            'year': 2024,
            'price': 18000000,
            'purchase_cost': 15000000,
            'images': [img1],
        }, format='multipart')
        v_id = create_res.json()['id']

        # Update specs only
        update_res = self.client.patch(f'/api/vehicles/{v_id}/', {
            'price': 17500000,
            'color': 'Frozen Deep Green',
            'description': 'Lightweight super sedan.',
        }, format='json')
        self.assertEqual(update_res.status_code, status.HTTP_200_OK)

        vehicle = Vehicle.objects.get(id=v_id)
        self.assertEqual(vehicle.gallery_images.count(), 1)
        self.assertEqual(vehicle.color, 'Frozen Deep Green')
        self.assertEqual(float(vehicle.price), 17500000.0)

    def test_remove_existing_image(self):
        """4. Remove an existing image and ensure the server updates the gallery."""
        self.auth_as_dealer()

        img1 = create_test_image('keep.jpg', color='yellow')
        img2 = create_test_image('remove_me.jpg', color='black')
        create_res = self.client.post('/api/vehicles/', {
            'brand': 'Audi',
            'model': 'RS e-tron GT',
            'year': 2025,
            'price': 20000000,
            'images': [img1, img2],
        }, format='multipart')
        v_id = create_res.json()['id']
        gallery = create_res.json()['gallery_images']
        to_delete_id = gallery[1]['id']

        # Delete image 2
        del_res = self.client.post(f'/api/vehicles/{v_id}/delete_gallery_image/', {
            'image_id': to_delete_id
        }, format='json')
        self.assertEqual(del_res.status_code, status.HTTP_200_OK)

        vehicle = Vehicle.objects.get(id=v_id)
        self.assertEqual(vehicle.gallery_images.count(), 1)
        self.assertFalse(vehicle.gallery_images.filter(id=to_delete_id).exists())

    def test_set_primary_image(self):
        """Designate one image as primary and ensure vehicle.image reflects it."""
        self.auth_as_dealer()

        img1 = create_test_image('first.jpg', color='red')
        img2 = create_test_image('second.jpg', color='blue')
        create_res = self.client.post('/api/vehicles/', {
            'brand': 'Aston Martin',
            'model': 'Vantage',
            'year': 2025,
            'price': 30000000,
            'images': [img1, img2],
        }, format='multipart')
        v_id = create_res.json()['id']
        gallery = create_res.json()['gallery_images']

        second_id = gallery[1]['id']
        # Set second image as primary
        set_prim_res = self.client.post(f'/api/vehicles/{v_id}/set_primary_image/', {
            'image_id': second_id
        }, format='json')
        self.assertEqual(set_prim_res.status_code, status.HTTP_200_OK)

        vehicle = Vehicle.objects.get(id=v_id)
        prim = vehicle.gallery_images.get(id=second_id)
        self.assertTrue(prim.is_primary)
        self.assertFalse(vehicle.gallery_images.get(id=gallery[0]['id']).is_primary)
        self.assertEqual(vehicle.image.name, prim.image.name)

    def test_public_vehicle_view_includes_gallery_and_primary_image(self):
        """Verify public vehicle details displays the gallery without leaking confidential margins."""
        self.auth_as_dealer()
        img1 = create_test_image('cover.jpg', color='gold')
        create_res = self.client.post('/api/vehicles/', {
            'brand': 'McLaren',
            'model': '750S',
            'year': 2025,
            'price': 42000000,
            'purchase_cost': 35000000,
            'images': [img1],
        }, format='multipart')
        v_id = create_res.json()['id']

        # Clear credentials (simulate guest public view)
        self.client.credentials()
        pub_res = self.client.get(f'/api/vehicles/{v_id}/')
        self.assertEqual(pub_res.status_code, status.HTTP_200_OK)
        pub_data = pub_res.json()

        self.assertIn('gallery_images', pub_data)
        self.assertEqual(len(pub_data['gallery_images']), 1)
        self.assertTrue(bool(pub_data['image']))
        # Confidential fields must be strictly excluded from customer view
        self.assertNotIn('purchase_cost', pub_data)
        self.assertNotIn('potential_margin', pub_data)

    def test_unauthorized_user_cannot_upload_or_delete_gallery_images(self):
        """Unauthorized guests and customers cannot upload or delete images."""
        # Setup vehicle
        self.auth_as_dealer()
        img = create_test_image('locked.jpg')
        create_res = self.client.post('/api/vehicles/', {
            'brand': 'Maserati',
            'model': 'MC20',
            'year': 2025,
            'price': 38000000,
            'images': [img],
        }, format='multipart')
        v_id = create_res.json()['id']
        img_id = create_res.json()['gallery_images'][0]['id']

        # 1. Guest
        self.client.credentials()
        guest_upload = self.client.post(f'/api/vehicles/{v_id}/upload_gallery_image/', {
            'image': create_test_image('hacker.jpg')
        }, format='multipart')
        self.assertEqual(guest_upload.status_code, status.HTTP_401_UNAUTHORIZED)

        guest_delete = self.client.post(f'/api/vehicles/{v_id}/delete_gallery_image/', {
            'image_id': img_id
        }, format='json')
        self.assertEqual(guest_delete.status_code, status.HTTP_401_UNAUTHORIZED)

        # 2. Customer
        self.auth_as_customer()
        cust_upload = self.client.post(f'/api/vehicles/{v_id}/upload_gallery_image/', {
            'image': create_test_image('cust.jpg')
        }, format='multipart')
        self.assertEqual(cust_upload.status_code, status.HTTP_403_FORBIDDEN)

        cust_delete = self.client.post(f'/api/vehicles/{v_id}/delete_gallery_image/', {
            'image_id': img_id
        }, format='json')
        self.assertEqual(cust_delete.status_code, status.HTTP_403_FORBIDDEN)

    def test_invalid_file_type_rejected(self):
        """Reject non-image files such as .txt or .exe."""
        self.auth_as_dealer()
        bad_file = SimpleUploadedFile('script.sh', b'#!/bin/bash\necho test', content_type='text/plain')

        res = self.client.post('/api/vehicles/', {
            'brand': 'Bugatti',
            'model': 'Tourbillon',
            'year': 2026,
            'price': 350000000,
            'images': [bad_file],
        }, format='multipart')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('unsupported extension', res.json().get('message', '').lower())

    def test_oversized_file_rejected(self):
        """Reject files exceeding 10MB."""
        self.auth_as_dealer()
        # Create dummy file > 10MB
        oversized = SimpleUploadedFile('huge.jpg', b'0' * (11 * 1024 * 1024), content_type='image/jpeg')

        res = self.client.post('/api/vehicles/', {
            'brand': 'Koenigsegg',
            'model': 'Jesko',
            'year': 2026,
            'price': 280000000,
            'images': [oversized],
        }, format='multipart')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('exceeds the maximum allowed size', res.json().get('message', '').lower())

    def test_legacy_vehicle_records_and_image_urls_still_work(self):
        """Verify backwards compatibility for vehicles with only image_url or single image."""
        legacy_vehicle = Vehicle.objects.create(
            brand='Mercedes-Benz',
            model='300 SL Gullwing',
            year=1954,
            price=120000000,
            image_url='https://images.unsplash.com/photo-1552519507-da3b142c6e3d'
        )

        # GET request from customer
        self.client.credentials()
        res = self.client.get(f'/api/vehicles/{legacy_vehicle.id}/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.json()['image'], 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d')
        self.assertEqual(res.json()['gallery_images'], [])
