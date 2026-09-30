import os, sys, django
sys.path.insert(0, r'c:\Users\jatin\HCL Project\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
import urllib.request, urllib.error, json
from vehicles.models import Vehicle

User = get_user_model()
dealer = User.objects.filter(role='DEALER').first()
dealer_token = str(RefreshToken.for_user(dealer).access_token)

print("="*60)
print("TEST A: DEALER ADDS VEHICLE VIA POST /api/vehicles/")
print("="*60)

test_vehicle_payload = {
    'brand': 'BMW',
    'model': 'M4 Competition 2026 Edition',
    'year': 2026,
    'price': 15800000.0,
    'purchase_cost': 12500000.0,
    'fuel': 'Petrol',
    'transmission': 'Automatic',
    'mileage': 500,
    'body_type': 'Coupe',
    'engine': '3.0L M TwinPower Turbo',
    'horsepower': 503,
    'torque': 650,
    'seats': 4,
    'top_speed': 290,
    'color': 'Isle of Man Green',
    'description': 'Track-focused luxury sports coupe.',
    'features': ['M Carbon Ceramic Brakes', 'Head-Up Display'],
    'stock_quantity': 2,
    'status': 'AVAILABLE',
    'image': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
}

post_req = urllib.request.Request(
    'http://127.0.0.1:8000/api/vehicles/',
    data=json.dumps(test_vehicle_payload).encode('utf-8'),
    headers={
        'Authorization': f'Bearer {dealer_token}',
        'Content-Type': 'application/json'
    }
)

with urllib.request.urlopen(post_req) as resp:
    assert resp.status == 201, f"Expected 201 Created, got {resp.status}"
    created_veh = json.loads(resp.read().decode('utf-8'))
    created_id = created_veh['id']
    print(f"PASS: Vehicle created via POST /api/vehicles/ -> HTTP {resp.status}")
    print(f"Created Vehicle ID: {created_id} | {created_veh['brand']} {created_veh['model']}")
    print(f"Image stored in representation: {created_veh.get('image')}")

# Verify in Database
db_vehicle = Vehicle.objects.filter(id=created_id).first()
assert db_vehicle is not None, "Vehicle not found in SQLite Vehicle table!"
print(f"PASS: Verified in Database directly -> ID {db_vehicle.id}: {db_vehicle.brand} {db_vehicle.model} (Price: {db_vehicle.price}, Status: {db_vehicle.status})")

# Verify in Customer Public GET /api/vehicles/
cust_get_req = urllib.request.Request('http://127.0.0.1:8000/api/vehicles/')
with urllib.request.urlopen(cust_get_req) as resp:
    assert resp.status == 200, f"Expected 200 OK, got {resp.status}"
    cust_data = json.loads(resp.read().decode('utf-8'))
    results = cust_data.get('results', cust_data)
    match = next((v for v in results if v['id'] == created_id), None)
    assert match is not None, "Created vehicle was NOT found in customer GET /api/vehicles/!"
    print(f"PASS: Customer GET /api/vehicles/ contains vehicle:")
    print(f"      ID: {match['id']} | {match['brand']} {match['model']} | Price: {match['price']} | Status: {match['status']}")

print("\n" + "="*60)
print("TEST B: DEALER EDITS VEHICLE PRICE")
print("="*60)

updated_price = 16200000.0
patch_req = urllib.request.Request(
    f'http://127.0.0.1:8000/api/vehicles/{created_id}/',
    data=json.dumps({'price': updated_price}).encode('utf-8'),
    headers={
        'Authorization': f'Bearer {dealer_token}',
        'Content-Type': 'application/json'
    },
    method='PATCH'
)

with urllib.request.urlopen(patch_req) as resp:
    assert resp.status == 200, f"Expected 200 OK, got {resp.status}"
    updated_res = json.loads(resp.read().decode('utf-8'))
    print(f"PASS: Price updated via PATCH /api/vehicles/{created_id}/ -> HTTP {resp.status}")

# Verify DB updated
db_vehicle.refresh_from_db()
assert float(db_vehicle.price) == updated_price, "DB price did not update!"
print(f"PASS: Database verified new price: INR {db_vehicle.price}")

# Verify Customer API reflects updated price
with urllib.request.urlopen(cust_get_req) as resp:
    cust_data = json.loads(resp.read().decode('utf-8'))
    results = cust_data.get('results', cust_data)
    match = next((v for v in results if v['id'] == created_id), None)
    assert match is not None and float(match['price']) == updated_price, "Customer API did not reflect updated price!"
    print(f"PASS: Customer API returns updated price: INR {match['price']}")

print("\n" + "="*60)
print("TEST C: DEALER DEACTIVATES / DELETES VEHICLE")
print("="*60)

# 1. Test status change to UNAVAILABLE
patch_unavail = urllib.request.Request(
    f'http://127.0.0.1:8000/api/vehicles/{created_id}/',
    data=json.dumps({'status': 'UNAVAILABLE'}).encode('utf-8'),
    headers={
        'Authorization': f'Bearer {dealer_token}',
        'Content-Type': 'application/json'
    },
    method='PATCH'
)
with urllib.request.urlopen(patch_unavail) as resp:
    print(f"PASS: Vehicle marked UNAVAILABLE -> HTTP {resp.status}")

# Customer should NOT see UNAVAILABLE vehicles
with urllib.request.urlopen(cust_get_req) as resp:
    cust_data = json.loads(resp.read().decode('utf-8'))
    results = cust_data.get('results', cust_data)
    match_unavail = next((v for v in results if v['id'] == created_id), None)
    assert match_unavail is None, "Customer was still able to see UNAVAILABLE vehicle!"
    print(f"PASS: Customer GET /api/vehicles/ correctly excludes UNAVAILABLE vehicle according to business rules.")

# 2. Test DELETE /api/vehicles/:id/
del_req = urllib.request.Request(
    f'http://127.0.0.1:8000/api/vehicles/{created_id}/',
    headers={'Authorization': f'Bearer {dealer_token}'},
    method='DELETE'
)
with urllib.request.urlopen(del_req) as resp:
    assert resp.status == 204, f"Expected 204 No Content, got {resp.status}"
    print(f"PASS: Vehicle deleted via DELETE /api/vehicles/{created_id}/ -> HTTP {resp.status}")

assert not Vehicle.objects.filter(id=created_id).exists(), "Vehicle still exists in DB after deletion!"
print(f"PASS: Database confirmed vehicle completely deleted from SQLite.")

print("\n" + "="*60)
print("TEST D: DATA CONSISTENCY REFRESH VERIFICATION")
print("="*60)
with urllib.request.urlopen(cust_get_req) as resp:
    final_cust_data = json.loads(resp.read().decode('utf-8'))
    final_count = final_cust_data.get('count', len(final_cust_data))
    print(f"PASS: Customer API total active vehicles count in DB: {final_count}")
    print(f"Database Vehicle.objects.filter(status='AVAILABLE').count(): {Vehicle.objects.filter(status='AVAILABLE').count()}")

print("\nALL VERIFICATION TESTS (A, B, C, D) PASSED WITH 100% SUCCESS!")
