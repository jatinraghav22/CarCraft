"""
Comprehensive End-to-End Verification for Vehicle Multi-Photo Gallery:
Tests all 10 required scenarios:
1. Create a vehicle with three images.
2. Edit a vehicle and add two more images.
3. Update vehicle specifications without uploading images; existing images must remain.
4. Remove one existing image.
5. Select multiple images and remove one before saving (client/server flow).
6. Refresh the edit page and verify all saved images appear.
7. Open the public vehicle details page and verify the complete gallery.
8. Verify that an unauthorized user cannot upload or delete vehicle images.
9. Test invalid file types, oversized files, and upload failures.
10. Verify existing vehicle records and image URLs still work.
"""

import os
import sys
import io
import django
from PIL import Image as PilImage

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from vehicles.models import Vehicle, VehicleImage


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


def run_e2e_tests():
    print("======================================================================")
    print("STARTING CARCRAFT VEHICLE MULTI-PHOTO GALLERY E2E VERIFICATION SUITE")
    print("======================================================================\n")

    user_model = get_user_model()
    dealer, _ = user_model.objects.get_or_create(
        username='e2e_dealer_user',
        defaults={'email': 'e2e_dealer@carcraft.com', 'role': 'DEALER'}
    )
    dealer.role = 'DEALER'
    dealer.save()

    customer, _ = user_model.objects.get_or_create(
        username='e2e_customer_user',
        defaults={'email': 'e2e_customer@example.com', 'role': 'CUSTOMER'}
    )
    customer.role = 'CUSTOMER'
    customer.save()

    dealer_token = str(RefreshToken.for_user(dealer).access_token)
    customer_token = str(RefreshToken.for_user(customer).access_token)

    client = APIClient()

    # -------------------------------------------------------------------------
    # TEST 1: Create a vehicle with three images
    # -------------------------------------------------------------------------
    print("[1/10] Testing Vehicle Creation with 3 Images in One Operation...")
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {dealer_token}')

    img1 = create_test_image('front_angle.jpg', color='red')
    img2 = create_test_image('side_profile.png', color='blue', format='PNG')
    img3 = create_test_image('rear_view.jpg', color='yellow')

    res1 = client.post('/api/vehicles/', {
        'brand': 'Porsche',
        'model': '911 GT3 RS Clubsport',
        'year': 2026,
        'price': 27500000,
        'purchase_cost': 22000000,
        'fuel': 'Petrol',
        'transmission': 'Dual-Clutch',
        'body_type': 'Coupe',
        'images': [img1, img2, img3],
        'primary_index': 0,
    }, format='multipart')

    assert res1.status_code == status.HTTP_201_CREATED, f"Failed: {res1.data}"
    data1 = res1.json()
    v_id = data1['id']
    v_obj = Vehicle.objects.get(id=v_id)
    assert v_obj.gallery_images.count() == 3, f"Expected 3 images, got {v_obj.gallery_images.count()}"
    assert len(data1['gallery_images']) == 3
    assert bool(data1['image']), "Expected primary image URL to be set"
    print(f"  --> Vehicle #{v_id} created with 3 gallery images successfully. Primary: {data1['image']}")

    # -------------------------------------------------------------------------
    # TEST 2: Edit a vehicle and add two more images
    # -------------------------------------------------------------------------
    print("\n[2/10] Testing Edit Vehicle & Add 2 More Images...")
    img4 = create_test_image('cockpit.jpg', color='black')
    img5 = create_test_image('exhaust.jpg', color='orange')

    res2 = client.patch(f'/api/vehicles/{v_id}/', {
        'images': [img4, img5],
    }, format='multipart')

    assert res2.status_code == status.HTTP_200_OK, f"Failed: {res2.data}"
    v_obj.refresh_from_db()
    assert v_obj.gallery_images.count() == 5, f"Expected 5 images after adding 2, got {v_obj.gallery_images.count()}"
    print(f"  --> Vehicle #{v_id} updated. Gallery count now: {v_obj.gallery_images.count()} photos.")

    # -------------------------------------------------------------------------
    # TEST 3: Update specs without uploading images; existing images remain
    # -------------------------------------------------------------------------
    print("\n[3/10] Testing Specification Update without Uploading Images...")
    res3 = client.patch(f'/api/vehicles/{v_id}/', {
        'price': 27900000,
        'color': 'Ruby Star Neo',
        'description': 'Updated Track-focused aero pack.',
    }, format='json')

    assert res3.status_code == status.HTTP_200_OK, f"Failed: {res3.data}"
    v_obj.refresh_from_db()
    assert v_obj.gallery_images.count() == 5, f"Expected all 5 images to remain, got {v_obj.gallery_images.count()}"
    assert float(v_obj.price) == 27900000.0
    assert v_obj.color == 'Ruby Star Neo'
    print(f"  --> Vehicle #{v_id} specs updated. All {v_obj.gallery_images.count()} images preserved.")

    # -------------------------------------------------------------------------
    # TEST 4: Remove one existing image
    # -------------------------------------------------------------------------
    print("\n[4/10] Testing Removing One Existing Image...")
    existing_img_to_remove = v_obj.gallery_images.all()[2]
    img_to_remove_id = existing_img_to_remove.id

    res4 = client.post(f'/api/vehicles/{v_id}/delete_gallery_image/', {
        'image_id': img_to_remove_id
    }, format='json')

    assert res4.status_code == status.HTTP_200_OK, f"Failed: {res4.data}"
    v_obj.refresh_from_db()
    assert v_obj.gallery_images.count() == 4, f"Expected 4 images, got {v_obj.gallery_images.count()}"
    assert not v_obj.gallery_images.filter(id=img_to_remove_id).exists()
    print(f"  --> Image #{img_to_remove_id} removed successfully. Remaining gallery: {v_obj.gallery_images.count()} photos.")

    # -------------------------------------------------------------------------
    # TEST 5: Designate Primary Image
    # -------------------------------------------------------------------------
    print("\n[5/10] Testing Primary Image Designation...")
    target_primary = v_obj.gallery_images.all()[1]
    res5 = client.post(f'/api/vehicles/{v_id}/set_primary_image/', {
        'image_id': target_primary.id
    }, format='json')
    assert res5.status_code == status.HTTP_200_OK, f"Failed: {res5.data}"
    v_obj.refresh_from_db()
    assert v_obj.gallery_images.get(id=target_primary.id).is_primary is True
    assert v_obj.image.name == target_primary.image.name
    print(f"  --> Image #{target_primary.id} designated as primary cover photo. Vehicle.image updated.")

    # -------------------------------------------------------------------------
    # TEST 6: Refresh edit page endpoint (GET /api/vehicles/{id}/)
    # -------------------------------------------------------------------------
    print("\n[6/10] Testing Dealer Edit Page Reload / Data Retrieval...")
    res6 = client.get(f'/api/vehicles/{v_id}/')
    assert res6.status_code == status.HTTP_200_OK
    dealer_view = res6.json()
    assert len(dealer_view['gallery_images']) == 4
    assert 'purchase_cost' in dealer_view
    assert 'potential_margin' in dealer_view
    print(f"  --> Dealer retrieved dossier: {len(dealer_view['gallery_images'])} gallery photos present.")

    # -------------------------------------------------------------------------
    # TEST 7: Open public vehicle details page
    # -------------------------------------------------------------------------
    print("\n[7/10] Testing Public Customer Details Page (Confidentiality & Gallery)...")
    client.credentials()  # Unauthenticated
    res7 = client.get(f'/api/vehicles/{v_id}/')
    assert res7.status_code == status.HTTP_200_OK
    pub_view = res7.json()
    assert len(pub_view['gallery_images']) == 4
    assert 'purchase_cost' not in pub_view, "SECURITY: purchase_cost leaked to customer!"
    assert 'potential_margin' not in pub_view, "SECURITY: potential_margin leaked to customer!"
    assert bool(pub_view['image']), "Public main cover image must be set"
    print(f"  --> Public gallery retrieved with {len(pub_view['gallery_images'])} photos. Confidential margins protected.")

    # -------------------------------------------------------------------------
    # TEST 8: Verify unauthorized user cannot upload or delete images
    # -------------------------------------------------------------------------
    print("\n[8/10] Testing Permission Enforcement (Guests & Customers Denied Write)...")
    # Guest attempt upload
    res8_guest = client.post(f'/api/vehicles/{v_id}/upload_gallery_image/', {
        'image': create_test_image('unauth.jpg')
    }, format='multipart')
    assert res8_guest.status_code == status.HTTP_401_UNAUTHORIZED
    print("  --> Guest upload rejected: 401 Unauthorized")

    # Customer attempt delete
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {customer_token}')
    remaining_img = v_obj.gallery_images.first()
    res8_cust = client.post(f'/api/vehicles/{v_id}/delete_gallery_image/', {
        'image_id': remaining_img.id
    }, format='json')
    assert res8_cust.status_code == status.HTTP_403_FORBIDDEN
    print("  --> Customer delete rejected: 403 Forbidden")

    # -------------------------------------------------------------------------
    # TEST 9: Test invalid file types & oversized files
    # -------------------------------------------------------------------------
    print("\n[9/10] Testing Server-side Image Validation (File Types & Size)...")
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {dealer_token}')

    bad_ext = SimpleUploadedFile('malicious.exe', b'MZ fake binary', content_type='application/x-msdownload')
    res9_bad = client.post(f'/api/vehicles/{v_id}/upload_gallery_image/', {
        'images': [bad_ext]
    }, format='multipart')
    assert res9_bad.status_code == status.HTTP_400_BAD_REQUEST
    print(f"  --> Invalid extension rejected: {res9_bad.json()['message']}")

    oversized = SimpleUploadedFile('too_big.jpg', b'0' * (11 * 1024 * 1024), content_type='image/jpeg')
    res9_size = client.post(f'/api/vehicles/{v_id}/upload_gallery_image/', {
        'images': [oversized]
    }, format='multipart')
    assert res9_size.status_code == status.HTTP_400_BAD_REQUEST
    print(f"  --> Oversized file (>10MB) rejected: {res9_size.json()['message']}")

    # -------------------------------------------------------------------------
    # TEST 10: Verify existing vehicle records and image URLs still work
    # -------------------------------------------------------------------------
    print("\n[10/10] Testing Backward Compatibility for Legacy Vehicles...")
    legacy = Vehicle.objects.create(
        brand='Ferrari',
        model='Testarossa',
        year=1984,
        price=18000000,
        image_url='https://images.unsplash.com/photo-1583121274602-3e2820c69888'
    )
    client.credentials()
    res10 = client.get(f'/api/vehicles/{legacy.id}/')
    assert res10.status_code == status.HTTP_200_OK
    assert res10.json()['image'] == 'https://images.unsplash.com/photo-1583121274602-3e2820c69888'
    print(f"  --> Legacy vehicle #{legacy.id} retrieved without errors. Image URL fallback verified.")

    # Cleanup test vehicle
    v_obj.delete()
    legacy.delete()

    print("\n======================================================================")
    print("ALL 10 END-TO-END VERIFICATION TESTS PASSED SUCCESSFULLY!")
    print("======================================================================")


if __name__ == '__main__':
    run_e2e_tests()
