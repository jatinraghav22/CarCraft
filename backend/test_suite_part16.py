import urllib.request
import urllib.parse
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def request_json(url, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    req_data = None
    if data is not None:
        req_data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode("utf-8")
            status = resp.status
            parsed = json.loads(body) if body.strip() else None
            return status, parsed, body
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        parsed = json.loads(body) if body.strip() else None
        return e.code, parsed, body

print("=" * 60)
print("RUNNING STEP 16 VERIFICATION SUITE")
print("=" * 60)

# Check current list
status, data, body = request_json(f"{BASE_URL}/api/vehicles/")
print(f"GET /api/vehicles/ Status: {status}")
results = data["results"] if isinstance(data, dict) and "results" in data else data
print(f"Current vehicles in API: {len(results)}")
for v in results:
    print(f" - [{v['id']}] {v['brand']} {v['model']} | Price: {v['price']} | VIN: {v.get('vin')} | Status: {v['status']}")

# TEST 1: Add one vehicle: BMW, M4 Competition, VIN: TEST-BMW-001
print("\n" + "=" * 60)
print("TEST 1: Add one vehicle (BMW M4 Competition, VIN: TEST-BMW-001)")
new_vehicle_payload = {
    "brand": "BMW",
    "model": "M4 Competition",
    "year": 2024,
    "price": "15300000.00",
    "purchase_cost": "12000000.00",
    "vin": "TEST-BMW-001",
    "fuel": "PETROL",
    "transmission": "AUTOMATIC",
    "body_type": "COUPE",
    "mileage": 1200,
    "status": "AVAILABLE",
    "stock": 1,
    "color": "Isle of Man Green",
    "engine": "3.0L M TwinPower Turbo I6",
    "power": "503 hp",
    "description": "Verification test unit."
}

post_status, created_data, _ = request_json(f"{BASE_URL}/api/vehicles/", method="POST", data=new_vehicle_payload)
print(f"POST /api/vehicles/ Status: {post_status}")
print(f"Created Vehicle ID: {created_data.get('id')}, VIN: {created_data.get('vin')}")
test_vid = created_data.get("id")

# TEST 2: Refresh Dealer page -> Exactly ONE new BMW M4
print("\n" + "=" * 60)
print("TEST 2: Verify Dealer Vehicle List has the new vehicle")
status, data, _ = request_json(f"{BASE_URL}/api/vehicles/")
results = data["results"] if isinstance(data, dict) and "results" in data else data
test_bmw_matches = [v for v in results if v.get("vin") == "TEST-BMW-001"]
print(f"Matches with VIN 'TEST-BMW-001': {len(test_bmw_matches)}")
assert len(test_bmw_matches) == 1, f"Expected 1 match, got {len(test_bmw_matches)}"

# TEST 3: Refresh Customer /vehicles -> Exactly ONE new BMW M4
print("\n" + "=" * 60)
print("TEST 3: Verify Customer /vehicles has the new vehicle")
status, cust_data, _ = request_json(f"{BASE_URL}/api/vehicles/")
cust_results = cust_data["results"] if isinstance(cust_data, dict) and "results" in cust_data else cust_data
cust_matches = [v for v in cust_results if v.get("vin") == "TEST-BMW-001"]
print(f"Customer matches with VIN 'TEST-BMW-001': {len(cust_matches)}")
assert len(cust_matches) == 1, f"Expected 1 customer match, got {len(cust_matches)}"
print(f"Customer vehicle details: ID={cust_matches[0]['id']}, Model={cust_matches[0]['model']}, Price={cust_matches[0]['price']}, Image={cust_matches[0].get('image') or cust_matches[0].get('hero_image')}")

# TEST 5 & 6: Delete BMW M4 -> Confirm 204 No Content, no JSON parsing error
print("\n" + "=" * 60)
print(f"TEST 5 & 6: DELETE /api/vehicles/{test_vid}/")
del_status, del_data, raw_body = request_json(f"{BASE_URL}/api/vehicles/{test_vid}/", method="DELETE")
print(f"DELETE Status: {del_status}")
print(f"DELETE Response Body: '{raw_body}' (Empty={len(raw_body)==0})")
assert del_status == 204, f"Expected 204, got {del_status}"
assert raw_body == "", f"Expected empty body on 204, got {raw_body}"

# TEST 7: Edit vehicle price
print("\n" + "=" * 60)
print("TEST 7: Edit vehicle price")
# Re-create a test vehicle for edit test
_, v_edit, _ = request_json(f"{BASE_URL}/api/vehicles/", method="POST", data=new_vehicle_payload)
v_id = v_edit["id"]
patch_payload = {"price": "16500000.00"}
patch_status, patch_data, _ = request_json(f"{BASE_URL}/api/vehicles/{v_id}/", method="PATCH", data=patch_payload)
print(f"PATCH /api/vehicles/{v_id}/ Status: {patch_status}")
print(f"Updated Price: {patch_data.get('price')}")
assert str(patch_data.get("price")) == "16500000.00", "Price not updated"

# Verify on Customer endpoint
get_status, get_cust_data, _ = request_json(f"{BASE_URL}/api/vehicles/{v_id}/")
print(f"Customer GET /api/vehicles/{v_id}/ Status: {get_status}")
print(f"Customer vehicle price: {get_cust_data.get('price')}")
assert str(get_cust_data.get("price")) == "16500000.00", "Customer price does not match"

# TEST 8: Customer opens vehicle details
print("\n" + "=" * 60)
print("TEST 8: Customer opens vehicle details")
assert get_cust_data.get("id") == v_id
assert get_cust_data.get("brand") == "BMW"
assert get_cust_data.get("model") == "M4 Competition"
assert get_cust_data.get("vin") == "TEST-BMW-001"
print(f"Details verified: ID={get_cust_data.get('id')}, Brand={get_cust_data.get('brand')}, Model={get_cust_data.get('model')}, VIN={get_cust_data.get('vin')}")

# Clean up
del_status, _, _ = request_json(f"{BASE_URL}/api/vehicles/{v_id}/", method="DELETE")
print(f"Cleaned up test vehicle {v_id}: Status {del_status}")

print("\n" + "=" * 60)
print("ALL API VERIFICATION CHECKS (TESTS 1 - 8) PASSED SUCCESSFULLY!")
print("=" * 60)

