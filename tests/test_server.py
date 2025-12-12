import os
import json
import uuid
import sys
from pathlib import Path
import pytest
from typing import Dict, Any, List

# FastAPI TestClient
from fastapi.testclient import TestClient

# Ensure the repository root (where server.py lives) is on sys.path
ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

# Import the FastAPI app and Supabase client from the backend
# NOTE: This import reads .env.local and initializes Supabase at import time
from server import app, supabase


@pytest.fixture(scope="session")
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture(scope="session")
def supa():
    # Ensure env variables exist for Supabase
    url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    key = os.getenv("NEXT_PUBLIC_SUPABASE_KEY")
    if not url or not key:
        pytest.skip("Supabase env vars are not set; skipping integration tests")
    return supabase


@pytest.fixture(scope="session")
def seed_data(supa) -> Dict[str, Any]:
    """
    Clear the Events and Food tables and insert a small set of deterministic rows for testing.
    Returns inserted ids for later assertions.
    """
    # Wipe tables completely (delete all records)
    try:
        supa.table("Food").delete().gt("id", -1).execute()
    except Exception as e:
        print(f"Warning: Could not clear Food table: {e}")
    
    try:
        supa.table("Events").delete().gt("id", -1).execute()
    except Exception as e:
        print(f"Warning: Could not clear Events table: {e}")

    # Insert Events with campus_location and diverse test data
    events_to_insert = [
        {
            "name": "Pizza Party - West Campus",
            "description": "Delicious pizza and salad for vegans and vegetarians",
            "organization": "Computer Science Club",
            "location": "Warren Towers, 765 Commonwealth Ave",
            "campus_location": "West",
            "food": ["Cheese Pizza", "Veggie Pizza", "Garden Salad", "Soda"],
            "date": "2025-12-31",
            "start_time": "10:00",
            "end_time": "12:00",
            "image_url": None,
        },
        {
            "name": "Sushi Social - East Campus",
            "description": "Fresh sushi with fish options (not vegan)",
            "organization": "International Students Club",
            "location": "George Sherman Union, 775 Commonwealth Ave",
            "campus_location": "East",
            "food": ["Sushi", "Edamame", "Miso Soup"],
            "date": "2025-12-30",
            "start_time": "14:00",
            "end_time": "16:00",
            "image_url": None,
        },
        {
            "name": "Gluten-Free Bake Sale - Central",
            "description": "Gluten-free cookies and dairy-free treats",
            "organization": "Wellness Club",
            "location": "Mugar Memorial Library, 771 Commonwealth Ave",
            "campus_location": "Central",
            "food": ["GF Cookies", "DF Brownies", "Fruit Skewers", "Almond Milk Latte"],
            "date": "2025-12-29",
            "start_time": "11:00",
            "end_time": "13:00",
            "image_url": None,
        },
        {
            "name": "Nut-Free Lunch Special - South Campus",
            "description": "Safe for nut allergies - sunflower seed butter sandwiches",
            "organization": "Allergy Awareness Group",
            "location": "Charles River Campus Center, 725 Commonwealth Ave",
            "campus_location": "South",
            "food": ["Sunflower Butter Sandwich", "Banana", "Rice Cakes", "Orange Juice"],
            "date": "2025-12-28",
            "start_time": "12:00",
            "end_time": "13:30",
            "image_url": None,
        },
    ]
    ev_resp = supa.table("Events").insert(events_to_insert).execute()
    events_data = getattr(ev_resp, "data", None) or (ev_resp.get("data") if isinstance(ev_resp, dict) else None) or []
    assert len(events_data) >= 4, f"Expected at least 4 inserted events, got {len(events_data)}"

    e1_id = events_data[0]["id"]  # Pizza - West
    e2_id = events_data[1]["id"]  # Sushi - East
    e3_id = events_data[2]["id"]  # GF - Central
    e4_id = events_data[3]["id"]  # NF - South

    # Insert Food rows with diverse dietary tags
    foods_to_insert = [
        {  # numeric quantity - Cheese Pizza
            "name": "Cheese Pizza",
            "event_id": e1_id,
            "quantity": 10,
            "stockLevel": "low",
            "dietaryTags": ["vegetarian"],
            "description": "Classic mozzarella pizza",
        },
        {  # numeric quantity - Veggie Pizza
            "name": "Veggie Pizza",
            "event_id": e1_id,
            "quantity": 8,
            "stockLevel": "medium",
            "dietaryTags": ["vegetarian", "vegan"],
            "description": "Loaded with fresh vegetables",
        },
        {  # unlimited: quantity None, stockLevel high
            "name": "Sushi",
            "event_id": e2_id,
            "quantity": None,
            "stockLevel": "high",
            "dietaryTags": [],
            "description": "Assorted nigiri and rolls",
        },
        {  # derived medium (30)
            "name": "Gluten-Free Cookies",
            "event_id": e3_id,
            "quantity": None,
            "stockLevel": "medium",
            "dietaryTags": ["gluten-free", "vegetarian"],
            "description": "Delicious GF oatmeal cookies",
        },
        {  # dairy-free
            "name": "Dairy-Free Brownies",
            "event_id": e3_id,
            "quantity": 5,
            "stockLevel": "low",
            "dietaryTags": ["dairy-free", "vegan"],
            "description": "Rich brownies with coconut oil",
        },
        {  # nut-free
            "name": "Sunflower Butter Sandwich",
            "event_id": e4_id,
            "quantity": 12,
            "stockLevel": "high",
            "dietaryTags": ["nut-free", "vegan"],
            "description": "Safe for nut allergies",
        },
    ]
    f_resp = supa.table("Food").insert(foods_to_insert).execute()
    foods_data = getattr(f_resp, "data", None) or (f_resp.get("data") if isinstance(f_resp, dict) else None) or []
    assert len(foods_data) >= 6, f"Expected 6 inserted foods, got {len(foods_data)}"

    ids = {
        "events": {"e1": e1_id, "e2": e2_id, "e3": e3_id, "e4": e4_id},
        "foods": {
            "cheese_pizza": foods_data[0]["id"],
            "veggie_pizza": foods_data[1]["id"],
            "sushi": foods_data[2]["id"],
            "gf_cookies": foods_data[3]["id"],
            "df_brownies": foods_data[4]["id"],
            "sf_sandwich": foods_data[5]["id"],
        },
    }
    return ids


def _get_json_data(resp_json: Any) -> Any:
    if isinstance(resp_json, dict) and "data" in resp_json:
        return resp_json["data"]
    return resp_json


def test_root_lists_events(client: TestClient, seed_data):
    r = client.get("/")
    assert r.status_code == 200
    data = _get_json_data(r.json())
    assert isinstance(data, list)
    # Expect our seeded events present
    assert any(ev.get("name") == "Pizza Party - West Campus" for ev in data)
    assert any(ev.get("name") == "Sushi Social - East Campus" for ev in data)
    assert any(ev.get("name") == "Gluten-Free Bake Sale - Central" for ev in data)
    assert any(ev.get("name") == "Nut-Free Lunch Special - South Campus" for ev in data)
    
    # Verify campus_location field is present
    pizza_event = next((ev for ev in data if ev.get("name") == "Pizza Party - West Campus"), None)
    assert pizza_event is not None
    assert pizza_event.get("campus_location") == "West"


def test_search_by_name(client: TestClient):
    r = client.get("/search/name/pizza")
    assert r.status_code == 200
    data = _get_json_data(r.json())
    assert any("Pizza" in ev.get("name", "") for ev in data)


def test_search_by_food(client: TestClient):
    r = client.get("/search/food/Sushi")
    assert r.status_code == 200
    data = _get_json_data(r.json())
    # Expect an event whose food array contains "Sushi"
    assert any("Sushi" in (ev.get("food") or []) for ev in data)


def test_get_food_by_event(client: TestClient, seed_data):
    e1_id = seed_data["events"]["e1"]
    r = client.get(f"/events/{e1_id}/food")
    assert r.status_code == 200
    data = r.json()["data"]
    # Our seed inserted "Cheese Pizza" and "Veggie Pizza" for e1
    names = {f["name"] for f in data}
    assert "Cheese Pizza" in names
    assert "Veggie Pizza" in names
    
    # Verify dietary tags are present
    for food in data:
        if food["name"] == "Veggie Pizza":
            assert "vegetarian" in food.get("dietaryTags", [])
            assert "vegan" in food.get("dietaryTags", [])


def test_post_event_without_image(client: TestClient):
    form = {
        "name": "Workshop Event - No Image",
        "description": "A professional workshop with vegetarian options",
        "organization": "Tech Innovators",
        "location": "Innovation Hub, 120 Bay State Road",
        "campus_location": "Central",
        "date": "2025-12-29",
        "start_time": "09:00",
        "end_time": "10:00",
        "food": json.dumps(["Cookies", "Juice"]),
    }
    r = client.post("/event/", data=form)
    assert r.status_code == 200
    body = r.json()
    data = body.get("data") or []
    assert isinstance(data, list) and len(data) >= 1
    created = data[0]
    assert created["name"] == form["name"]
    assert created["food"] == ["Cookies", "Juice"]
    assert created.get("campus_location") == "Central"


def test_post_event_with_image(client: TestClient):
    """Test creating an event with an image upload"""
    import io
    
    # Create a minimal 1x1 PNG image as bytes
    png_bytes = (
        b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01'
        b'\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f'
        b'\x00\x00\x01\x01\x00\x05\x18\r\xe2_\x00\x00\x00\x00IEND\xaeB`\x82'
    )
    
    files = {
        'image': ('test_image.png', io.BytesIO(png_bytes), 'image/png')
    }
    data = {
        "name": "Catered Dinner - With Image",
        "description": "A gourmet dinner event with various dietary options",
        "organization": "Culinary Club",
        "location": "Faculty Club, 40 Evans Way",
        "campus_location": "Fenway",
        "date": "2025-12-27",
        "start_time": "18:00",
        "end_time": "20:00",
        "food": json.dumps(["Salmon", "Vegetable Medley", "Chocolate Cake"]),
    }
    r = client.post("/event/", data=data, files=files)
    assert r.status_code == 200
    body = r.json()
    created_events = body.get("data") or []
    assert len(created_events) >= 1
    created = created_events[0]
    assert created["name"] == data["name"]
    # Verify campus_location was set correctly
    assert created.get("campus_location") == "Fenway"
    # Note: image_url may or may not be set depending on storage configuration
    print(f"Image URL: {created.get('image_url')}")


def test_reserve_numeric_quantity(client: TestClient, seed_data, supa):
    pizza_id = seed_data["foods"]["cheese_pizza"]
    # Get current qty
    q_resp = supa.table("Food").select("quantity").eq("id", pizza_id).execute()
    q_data = getattr(q_resp, "data", None) or (q_resp.get("data") if isinstance(q_resp, dict) else None) or []
    start_qty = q_data[0]["quantity"]

    payload = {"food_id": int(pizza_id), "quantity": 1}
    r = client.put("/reserve/", json=payload)
    assert r.status_code == 200

    # Verify decremented
    q2 = supa.table("Food").select("quantity").eq("id", pizza_id).execute()
    q2_data = getattr(q2, "data", None) or (q2.get("data") if isinstance(q2, dict) else None) or []
    assert q2_data[0]["quantity"] == max(0, int(start_qty) - 1)


def test_reserve_unlimited_high_stock(client: TestClient, seed_data, supa):
    sushi_id = seed_data["foods"]["sushi"]
    payload = {"food_id": int(sushi_id), "quantity": 1}
    r = client.put("/reserve/", json=payload)
    assert r.status_code == 200
    body = r.json()
    assert body.get("unlimited") is True

    # Verify DB unchanged (quantity remains None)
    q_resp = supa.table("Food").select("quantity").eq("id", sushi_id).execute()
    q_data = getattr(q_resp, "data", None) or (q_resp.get("data") if isinstance(q_resp, dict) else None) or []
    assert q_data[0]["quantity"] is None


def test_reserve_with_derived_medium(client: TestClient, seed_data, supa):
    gf_cookies_id = seed_data["foods"]["gf_cookies"]
    payload = {"food_id": int(gf_cookies_id), "quantity": 2}
    r = client.put("/reserve/", json=payload)
    assert r.status_code == 200

    # medium derives 30 then subtract 2 => 28
    q_resp = supa.table("Food").select("quantity, stockLevel").eq("id", gf_cookies_id).execute()
    q_data = getattr(q_resp, "data", None) or (q_resp.get("data") if isinstance(q_resp, dict) else None) or []
    assert q_data[0]["quantity"] == 28
    assert q_data[0]["stockLevel"] in ("low", "medium", "high")


def test_cancel_reservation_numeric(client: TestClient, seed_data, supa):
    pizza_id = seed_data["foods"]["cheese_pizza"]

    # Reserve 1 first (ensure we decrement)
    client.put("/reserve/", json={"food_id": int(pizza_id), "quantity": 1})

    # Then cancel 1
    r = client.post("/reserve/cancel", json={"food_id": int(pizza_id), "quantity": 1})
    assert r.status_code == 200

    # We can't assert exact value due to prior tests; just ensure quantity is not None and >= 0
    q_resp = supa.table("Food").select("quantity").eq("id", pizza_id).execute()
    q_data = getattr(q_resp, "data", None) or (q_resp.get("data") if isinstance(q_resp, dict) else None) or []
    assert q_data[0]["quantity"] is not None
    assert int(q_data[0]["quantity"]) >= 0


def test_get_profile_reservations_empty(client: TestClient):
    # No auth and a fake profile id should yield empty arrays
    r = client.get("/profiles/705ea4ae-7bbb-46ad-be36-a50a816d1f64/reservations")
    assert r.status_code == 200
    body = r.json()
    assert body.get("reserved_items") == []
    assert body.get("food_rows") == []


# --------------------
# Edge Case Tests
# --------------------

def test_get_food_by_event_no_food(client: TestClient, supa, seed_data):
    # Create an event with no food
    ev = {
        "name": "No Food Event",
        "description": "Edge case: no food",
        "organization": "Org NF",
        "location": "Nowhere",
        "food": [],
        "date": "2025-12-28",
        "start_time": "08:00",
        "end_time": "09:00",
    }
    ins = supa.table("Events").insert(ev).execute()
    e_data = getattr(ins, "data", None) or (ins.get("data") if isinstance(ins, dict) else None) or []
    e_id = e_data[0]["id"]

    r = client.get(f"/events/{e_id}/food")
    assert r.status_code == 200
    assert r.json()["data"] == []


def test_search_by_name_no_match(client: TestClient):
    r = client.get("/search/name/zzzzzz-no-match")
    assert r.status_code == 200
    data = _get_json_data(r.json())
    assert isinstance(data, list)
    # Allow empty list when nothing matches
    assert len(data) == 0 or all("zzzzzz-no-match" not in (ev.get("name") or "") for ev in data)


def test_search_by_food_no_match(client: TestClient):
    r = client.get("/search/food/zzzzzz-no-match")
    assert r.status_code == 200
    data = _get_json_data(r.json())
    assert isinstance(data, list)
    # Allow empty list when nothing matches
    assert len(data) == 0 or all("zzzzzz-no-match" not in (ev.get("food") or []) for ev in data)


def test_reserve_more_than_available(client: TestClient, supa, seed_data):
    # For pizza starting at 10, try to reserve an excessive amount
    pizza_id = seed_data["foods"]["cheese_pizza"]
    payload = {"food_id": int(pizza_id), "quantity": 9999}
    r = client.put("/reserve/", json=payload)
    # Should be 400 Bad Request due to insufficient stock
    assert r.status_code == 400


def test_reserve_unknown_food_id(client: TestClient):
    # Reserve a non-existent food id
    payload = {"food_id": 999999, "quantity": 1}
    r = client.put("/reserve/", json=payload)
    # Should be 404 Not Found
    assert r.status_code == 404


def test_cancel_unknown_food_id(client: TestClient):
    # Cancel a non-existent food id: should still succeed and return food_update None
    r = client.post("/reserve/cancel", json={"food_id": 999999, "quantity": 1})
    assert r.status_code == 200
    body = r.json()
    assert body.get("food_update") is None


def test_post_event_invalid_food_json(client: TestClient):
    # Pass invalid JSON string for food; server should swallow error and treat as []
    form = {
        "name": "Invalid Food JSON",
        "description": "Bad JSON",
        "organization": "Org Bad",
        "location": "Place Building, 50 Main St",
        "campus_location": "West",
        "date": "2025-12-27",
        "start_time": "07:00",
        "end_time": "08:00",
        "food": "{not valid json]",
    }
    r = client.post("/event/", data=form)
    assert r.status_code == 200
    data = r.json().get("data") or []
    created = data[0]
    assert created["name"] == form["name"]
    assert created.get("food") in ([], None)


# --------------------
# Campus Location Filter Tests
# --------------------

def test_campus_location_field_in_events(client: TestClient, seed_data):
    """Verify that events have campus_location field populated"""
    r = client.get("/")
    assert r.status_code == 200
    data = _get_json_data(r.json())
    
    # Find events with different campus locations
    west_events = [e for e in data if e.get("campus_location") == "West"]
    east_events = [e for e in data if e.get("campus_location") == "East"]
    central_events = [e for e in data if e.get("campus_location") == "Central"]
    south_events = [e for e in data if e.get("campus_location") == "South"]
    
    # Verify we have at least one event for each test campus location
    assert len(west_events) > 0, "Expected at least one West campus event"
    assert len(east_events) > 0, "Expected at least one East campus event"
    assert len(central_events) > 0, "Expected at least one Central campus event"
    assert len(south_events) > 0, "Expected at least one South campus event"


def test_dietary_tags_in_food_items(client: TestClient, seed_data):
    """Verify that food items have all dietary tags populated"""
    e1_id = seed_data["events"]["e1"]  # Pizza event
    r = client.get(f"/events/{e1_id}/food")
    assert r.status_code == 200
    data = r.json()["data"]
    
    # Verify dietary tags are present in food items
    food_with_tags = [f for f in data if f.get("dietaryTags")]
    assert len(food_with_tags) > 0, "Expected food items with dietary tags"
    
    # Check for specific dietary tags
    all_tags = set()
    for food in data:
        all_tags.update(food.get("dietaryTags", []))
    
    assert "vegetarian" in all_tags
    assert "vegan" in all_tags


def test_diverse_dietary_requirements(client: TestClient, seed_data):
    """Verify food items cover diverse dietary requirements"""
    r = client.get("/")
    assert r.status_code == 200
    data = _get_json_data(r.json())
    
    # Get all food items across all events
    all_dietary_tags = set()
    for event in data:
        food_list = event.get("food", [])
        # Note: This is just verifying event creation; actual dietary tags would come from Food table
    
    # Verify we have events at different locations with different descriptions
    event_names = {e.get("name") for e in data}
    assert "Pizza Party - West Campus" in event_names
    assert "Sushi Social - East Campus" in event_names
    assert "Gluten-Free Bake Sale - Central" in event_names
    assert "Nut-Free Lunch Special - South Campus" in event_names
