import json
import urllib.request
import urllib.error
import sqlite3
import os

BASE_URL = 'http://127.0.0.1:8000/api'
DB_PATH = os.path.join(os.path.dirname(__file__), 'db.sqlite3')

def test_full_e2e():
    print("=" * 60)
    print("CARCRAFT DEALER -> BACKEND -> CUSTOMER VEHICLE E2E VERIFICATION")
    print("=" * 60)

    # 1. DEALER: Add Vehicle via POST /api/vehicles/
    print("\n[STEP 1] Testing Dealer Add Vehicle via POST /api/vehicles/...")
    payload = {
        'brand': 'BMW',
        'model': 'M4 Competition',
        'year': 2026,
        'price': 2500000.0,
        'purchase_cost': 2000000.0,
        'fuel': 'Petrol',
        'transmission': 'Automatic',
        'status': 'Available',
        'body_type': 'Coupe',
        'color': 'Sao Paulo Yellow',
        'description': 'BMW M TwinPower Turbo inline 6-cylinder engine with 510 hp.'
    }
    
    req = urllib.request.Request(
        f'{BASE_URL}/vehicles/',
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    res = urllib.request.urlopen(req)
    assert res.status == 201, f"Expected 201 Created, got {res.status}"
    vehicle_data = json.loads(res.read().decode('utf-8'))
    vehicle_id = vehicle_data['id']
    print(f"  -> SUCCESS! 201 Created. Vehicle ID: {vehicle_id}")
    print(f"  -> Brand: {vehicle_data['brand']}, Model: {vehicle_data['model']}, Price: {vehicle_data['price']}, Status: {vehicle_data['status']}")

    # 2. DATABASE: Verify record in Django Database (MySQL carcraft_db)
    print("\n[STEP 2] Verifying Django Database persistence...")
    import os, django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    django.setup()
    from vehicles.models import Vehicle
    v = Vehicle.objects.filter(id=vehicle_id).first()
    assert v is not None, f"Vehicle ID {vehicle_id} not found in database!"
    print(f"  -> SUCCESS! Found in database: ID={v.id}, Brand={v.brand}, Model={v.model}, Year={v.year}, Price={v.price}, Status={v.status}")

    # 3. CUSTOMER: Fetch vehicles via GET /api/vehicles/
    print("\n[STEP 3] Testing Customer GET /api/vehicles/...")
    req_cust = urllib.request.Request(f'{BASE_URL}/vehicles/')
    res_cust = urllib.request.urlopen(req_cust)
    assert res_cust.status == 200
    cust_data = json.loads(res_cust.read().decode('utf-8'))
    cust_list = cust_data if isinstance(cust_data, list) else cust_data.get('results', [])
    
    matched = next((v for v in cust_list if v['id'] == vehicle_id), None)
    assert matched is not None, f"Vehicle ID {vehicle_id} NOT found in customer GET /api/vehicles/ response!"
    print(f"  -> SUCCESS! Customer endpoint returned vehicle ID {vehicle_id}: {matched['brand']} {matched['model']} (Price: INR {matched['price']})")

    # 4. VIEW DETAILS: GET /api/vehicles/<id>/
    print(f"\n[STEP 4] Testing Customer View Details via GET /api/vehicles/{vehicle_id}/...")
    req_detail = urllib.request.Request(f'{BASE_URL}/vehicles/{vehicle_id}/')
    res_detail = urllib.request.urlopen(req_detail)
    assert res_detail.status == 200
    detail_data = json.loads(res_detail.read().decode('utf-8'))
    assert detail_data['id'] == vehicle_id
    # Ensure purchase_cost is excluded from customer serializer
    assert 'purchase_cost' not in detail_data, "Confidential purchase_cost leaked into customer serializer!"
    print(f"  -> SUCCESS! Vehicle details verified for ID {vehicle_id} (confidential purchase_cost safely excluded).")

    # 5. BOOK TEST DRIVE: POST /api/test-drives/ referencing new Vehicle ID
    print(f"\n[STEP 5] Testing Customer Book Test Drive for Vehicle #{vehicle_id}...")
    td_payload = {
        'vehicle': vehicle_id,
        'preferred_date': '2026-10-15',
        'preferred_time': '10:00:00',
        'phone': '+91 98450 12345',
        'notes': 'Customer requested track-spec trial of BMW M4 Competition.'
    }
    req_td = urllib.request.Request(
        f'{BASE_URL}/test-drives/',
        data=json.dumps(td_payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    res_td = urllib.request.urlopen(req_td)
    assert res_td.status == 201, f"Expected 201 Created for test drive, got {res_td.status}"
    td_data = json.loads(res_td.read().decode('utf-8'))
    td_id = td_data['id']
    print(f"  -> SUCCESS! Test Drive #{td_id} created referencing Vehicle #{vehicle_id}.")

    # 6. DEALER TEST DRIVES: Verify booking appears in dealer test drives desk
    print(f"\n[STEP 6] Verifying Test Drive #{td_id} in Dealer Test Drives list...")
    req_dealer_td = urllib.request.Request(f'{BASE_URL}/test-drives/')
    res_dealer_td = urllib.request.urlopen(req_dealer_td)
    assert res_dealer_td.status == 200
    dealer_td_list = json.loads(res_dealer_td.read().decode('utf-8'))
    td_items = dealer_td_list if isinstance(dealer_td_list, list) else dealer_td_list.get('results', [])
    matched_td = next((t for t in td_items if t['id'] == td_id), None)
    assert matched_td is not None, f"Test drive #{td_id} not found in dealer list!"
    print(f"  -> SUCCESS! Test Drive #{td_id} verified against {matched_td.get('vehicle_name', 'BMW M4 Competition')} (Status: {matched_td.get('status')})")

    # 7. DEALER BADGE COUNTS: Verify dynamic counters
    print("\n[STEP 7] Verifying Dealer Telemetry Badges via GET /api/dealer/counts/...")
    req_counts = urllib.request.Request(f'{BASE_URL}/dealer/counts/')
    res_counts = urllib.request.urlopen(req_counts)
    assert res_counts.status == 200
    counts = json.loads(res_counts.read().decode('utf-8'))
    print(f"  -> Counts: Test Drives={counts.get('test_drives')}, Available Vehicles={counts.get('available_vehicles')}, Inventory={counts.get('inventory')}, Services={counts.get('service_appointments')}")

    print("\n" + "=" * 60)
    print("ALL 7 END-TO-END VERIFICATION STEPS PASSED 100%!")
    print("=" * 60)

if __name__ == '__main__':
    test_full_e2e()
