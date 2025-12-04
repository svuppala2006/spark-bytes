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
    # Wipe tables (requires a filter for delete in Supabase)
    try:
        supa.table("Food").delete().gte("id", 0).execute()
    except Exception:
        # ignore if table empty or other benign error
        pass
    try:
        supa.table("Events").delete().gte("id", 0).execute()
    except Exception:
        pass

    # Insert Events
    events_to_insert = [
        {
            "name": "Test Alpha Pizza",
            "description": "Alpha event for pizza",
            "organization": "Org A",
            "location": "Building A",
            "food": ["Pizza", "Salad"],
            "date": "2025-12-31",
            "start_time": "10:00",
            "end_time": "12:00",
            "image_url": None,
        },
        {
            "name": "Test Beta Sushi",
            "description": "Beta event for sushi",
            "organization": "Org B",
            "location": "Building B",
            "food": ["Sushi"],
            "date": "2025-12-30",
            "start_time": "14:00",
            "end_time": "16:00",
            "image_url": None,
        },
    ]
    ev_resp = supa.table("Events").insert(events_to_insert).execute()
    events_data = getattr(ev_resp, "data", None) or (ev_resp.get("data") if isinstance(ev_resp, dict) else None) or []
    assert len(events_data) >= 2, "Expected at least 2 inserted events"

    e1_id = events_data[0]["id"]
    e2_id = events_data[1]["id"]

    # Insert Food rows: one numeric quantity, one unlimited (high), one derived (medium)
    foods_to_insert = [
        {  # numeric quantity
            "name": "Pizza",
            "event_id": e1_id,
            "quantity": 10,
            "stockLevel": "low",
            "dietaryTags": ["vegetarian"],
            "description": "Cheese pizza",
        },
        {  # unlimited: quantity None, stockLevel high
            "name": "Sushi",
            "event_id": e2_id,
            "quantity": None,
            "stockLevel": "high",
            "dietaryTags": ["fish"],
            "description": "Assorted sushi",
        },
        {  # derived medium (30)
            "name": "Sandwich",
            "event_id": e1_id,
            "quantity": None,
            "stockLevel": "medium",
            "dietaryTags": [],
            "description": "Veg sandwich",
        },
    ]
    f_resp = supa.table("Food").insert(foods_to_insert).execute()
    foods_data = getattr(f_resp, "data", None) or (f_resp.get("data") if isinstance(f_resp, dict) else None) or []
    assert len(foods_data) >= 3, "Expected 3 inserted foods"

    ids = {
        "events": {"e1": e1_id, "e2": e2_id},
        "foods": {
            "pizza": foods_data[0]["id"],
            "sushi": foods_data[1]["id"],
            "sandwich": foods_data[2]["id"],
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
    # Expect at least our seeded events present
    assert any(ev.get("name") == "Test Alpha Pizza" for ev in data)
    assert any(ev.get("name") == "Test Beta Sushi" for ev in data)


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
    # Our seed inserted at least "Pizza" and "Sandwich" for e1
    names = {f["name"] for f in data}
    assert {"Pizza", "Sandwich"}.issubset(names)


def test_post_event_without_image(client: TestClient):
    form = {
        "name": "Created From Test",
        "description": "Event created via pytest",
        "organization": "PyTest Org",
        "location": "Test Hall",
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


def test_reserve_numeric_quantity(client: TestClient, seed_data, supa):
    pizza_id = seed_data["foods"]["pizza"]
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
    sandwich_id = seed_data["foods"]["sandwich"]
    payload = {"food_id": int(sandwich_id), "quantity": 2}
    r = client.put("/reserve/", json=payload)
    assert r.status_code == 200

    # medium derives 30 then subtract 2 => 28
    q_resp = supa.table("Food").select("quantity, stockLevel").eq("id", sandwich_id).execute()
    q_data = getattr(q_resp, "data", None) or (q_resp.get("data") if isinstance(q_resp, dict) else None) or []
    assert q_data[0]["quantity"] == 28
    assert q_data[0]["stockLevel"] in ("low", "medium", "high")


def test_cancel_reservation_numeric(client: TestClient, seed_data, supa):
    pizza_id = seed_data["foods"]["pizza"]

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
    pizza_id = seed_data["foods"]["pizza"]
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
        "location": "Place",
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
