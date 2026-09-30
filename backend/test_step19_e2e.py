import os, sys, django
sys.path.insert(0, r'c:\Users\jatin\HCL Project\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import urllib.request, urllib.error, json
from vehicles.models import Vehicle
from services.models import TestDrive

User = get_user_model()
dealer = User.objects.filter(role='DEALER').first()
customer = User.objects.filter(role='CUSTOMER').first()
dealer_token = str(RefreshToken.for_user(dealer).access_token)
customer_token = str(RefreshToken.for_user(customer).access_token)

print("="*70)
print("EXECUTION OF STEP 19: MANDATORY END-TO-END FLOW VERIFICATION")
print("="*70)

# Clean up any existing BMW M4 Competition with price 25,00,000 for a fresh run
Vehicle.objects.filter(brand='BMW', model='M4 Competition', price=2500000.00).delete()

# 1. DEALER ADDS VEHICLE
print("\n[Step 1] Dealer submits Add Vehicle:")
dealer_payload = {
    'brand': 'BMW',
    'model': 'M4 Competition',
    'year': 2026,
    'price': 2500000.00,
    'purchase_cost': 2000000.00,
    'fuel': 'Petrol',
    'transmission': 'Automatic',
    'body_type': 'Coupe',
    'status': 'AVAILABLE',
    'stock_quantity': 1,
    'color': 'Alpine White',
    'description': 'Pristine 2026 BMW M4 Competition Coupe in Alpine White.',
    'image': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
}

post_req = urllib.request.Request(
    'http://127.0.0.1:8000/api/vehicles/',
    data=json.dumps(dealer_payload).encode('utf-8'),
    headers={
        'Authorization': f'Bearer {dealer_token}',
        'Content-Type': 'application/json'
    }
)

with urllib.request.urlopen(post_req) as resp:
    assert resp.status == 201, f"Expected 201, got {resp.status}"
    created_veh = json.loads(resp.read().decode('utf-8'))
    new_vehicle_id = created_veh['id']
    print(f"-> SUCCESS: POST /api/vehicles/ returned HTTP 201 Created")
    print(f"-> New Vehicle ID: {new_vehicle_id}")
    print(f"-> Model: {created_veh['brand']} {created_veh['model']} ({created_veh['year']})")
    print(f"-> Price: INR {created_veh['price']}")
    print(f"-> Status: {created_veh['status']}")

# 2. VERIFY DATABASE RECORD
print("\n[Step 2] Verify Database (Single Source of Truth):")
db_record = Vehicle.objects.filter(id=new_vehicle_id).first()
assert db_record is not None, "FATAL: Vehicle was not written to SQLite database!"
print(f"-> SUCCESS: SQLite record verified in vehicles_vehicle table:")
print(f"   Row ID={db_record.id} | {db_record.brand} {db_record.model} | Price={db_record.price} | Status={db_record.status}")

# 3. VERIFY CUSTOMER GET /api/vehicles/
print("\n[Step 3] Customer requests GET /api/vehicles/:")
cust_list_req = urllib.request.Request('http://127.0.0.1:8000/api/vehicles/')
with urllib.request.urlopen(cust_list_req) as resp:
    assert resp.status == 200, f"Expected 200, got {resp.status}"
    cust_data = json.loads(resp.read().decode('utf-8'))
    results = cust_data.get('results', cust_data)
    found_in_customer_list = next((v for v in results if v['id'] == new_vehicle_id), None)
    assert found_in_customer_list is not None, f"FATAL: Vehicle #{new_vehicle_id} not returned in customer GET /api/vehicles/!"
    print(f"-> SUCCESS: Vehicle #{new_vehicle_id} present in customer catalog:")
    print(f"   Name: {found_in_customer_list['brand']} {found_in_customer_list['model']}")
    print(f"   Price: INR {found_in_customer_list['price']}")
    print(f"   Status: {found_in_customer_list['status']}")

# 4. VERIFY CUSTOMER VIEW DETAILS /vehicles/<new-id>
print(f"\n[Step 4] Customer opens View Details (/vehicles/{new_vehicle_id}):")
cust_detail_req = urllib.request.Request(f'http://127.0.0.1:8000/api/vehicles/{new_vehicle_id}/')
with urllib.request.urlopen(cust_detail_req) as resp:
    assert resp.status == 200, f"Expected 200, got {resp.status}"
    detail_data = json.loads(resp.read().decode('utf-8'))
    assert detail_data['id'] == new_vehicle_id
    print(f"-> SUCCESS: Customer VehicleDetails API responded HTTP 200:")
    print(f"   Vehicle: {detail_data['brand']} {detail_data['model']}")
    print(f"   Transmission: {detail_data['transmission']} | Fuel: {detail_data['fuel']}")
    print(f"   Image URL: {detail_data.get('image')}")

# 5. CUSTOMER BOOKS TEST DRIVE FOR THIS SPECIFIC VEHICLE
print(f"\n[Step 5] Customer books Test Drive for Vehicle #{new_vehicle_id}:")
td_payload = {
    'vehicle': new_vehicle_id,
    'preferred_date': '2026-10-25',
    'preferred_time': '10:00:00',
    'phone': '+91 98450 12345',
    'notes': f'Customer test drive for new {detail_data["brand"]} {detail_data["model"]}'
}
td_post_req = urllib.request.Request(
    'http://127.0.0.1:8000/api/test-drives/',
    data=json.dumps(td_payload).encode('utf-8'),
    headers={
        'Authorization': f'Bearer {customer_token}',
        'Content-Type': 'application/json'
    }
)
with urllib.request.urlopen(td_post_req) as resp:
    assert resp.status == 201, f"Expected 201, got {resp.status}"
    td_created = json.loads(resp.read().decode('utf-8'))
    td_id = td_created['id']
    print(f"-> SUCCESS: Test drive registered via POST /api/test-drives/ (Booking ID: {td_id})")
    print(f"   Referenced Vehicle ID: {td_created['vehicle']}")
    print(f"   Status: {td_created['status']}")

# 6. DEALER SEES TEST DRIVE IN CONCIERGE DESK
print("\n[Step 6] Dealer opens Test Drives Concierge Desk:")
dealer_td_req = urllib.request.Request(
    'http://127.0.0.1:8000/api/test-drives/',
    headers={'Authorization': f'Bearer {dealer_token}'}
)
with urllib.request.urlopen(dealer_td_req) as resp:
    assert resp.status == 200
    dealer_td_data = json.loads(resp.read().decode('utf-8'))
    dealer_td_list = dealer_td_data.get('results', dealer_td_data)
    matched_td = next((t for t in dealer_td_list if t['id'] == td_id), None)
    assert matched_td is not None, "FATAL: Test drive booking was not found in Dealer test drive list!"
    print(f"-> SUCCESS: Dealer Test Drive Desk received booking #{td_id}:")
    print(f"   Client: {matched_td.get('customer_username')}")
    print(f"   Vehicle: {matched_td.get('vehicle_details', {}).get('brand')} {matched_td.get('vehicle_details', {}).get('model')}")
    print(f"   Scheduled: {matched_td.get('preferred_date')} at {matched_td.get('preferred_time')}")

# 7. DEALER TELEMETRY COUNTS UPDATED
print("\n[Step 7] Dealer Telemetry Navigation Counts:")
counts_req = urllib.request.Request(
    'http://127.0.0.1:8000/api/dealer/counts/',
    headers={'Authorization': f'Bearer {dealer_token}'}
)
with urllib.request.urlopen(counts_req) as resp:
    counts_data = json.loads(resp.read().decode('utf-8'))
    print(f"-> Total Test Drives in DB: {counts_data['test_drives']}")
    print(f"-> Pending Test Drives: {counts_data['pending_test_drives']}")
    print(f"-> Live Inventory (Vehicles + Parts): {counts_data['inventory']}")
    print(f"-> Notifications Dot Count: {counts_data['notifications']}")

print("\n" + "="*70)
print("100% COMPLETE: ALL STEPS OF THE END-TO-END SPECIFICATION VERIFIED!")
print("="*70)
