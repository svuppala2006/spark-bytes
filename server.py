import os
from fastapi import FastAPI, HTTPException, status, Request, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import dotenv
import uvicorn
from supabase import create_client, Client
from pydantic import BaseModel, Field, field_validator, ValidationInfo
from typing import Optional, List
from enum import Enum
import json

# Create the FastAPI app early so middleware and routes can be added
app = FastAPI()

# Get allowed origins from environment or use defaults
ALLOWED_ORIGINS = [
    "http://localhost:3000",           # Local development
    "http://127.0.0.1:3000",           # Local development
    "http://localhost:3001",           # Alternate local port
    "https://spark-bytes-iota.vercel.app",  # Vercel production
]

# Add production domains
vercel_url = os.getenv("VERCEL_URL")
if vercel_url:
    ALLOWED_ORIGINS.append(f"https://{vercel_url}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

dotenv.load_dotenv(dotenv_path='.env.local')

# Support both NEXT_PUBLIC_ and regular env var names
url: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL")
key: str = os.getenv("NEXT_PUBLIC_SUPABASE_KEY") or os.getenv("SUPABASE_KEY")


# Simple stock level enum used by the reserve/cancel logic
class StockLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


# Request model for reserving an item
class ReserveRequest(BaseModel):
    food_id: int
    quantity: int = Field(..., gt=0)
    profile_id: Optional[str] = None


# Model for adding food items
class FoodItem(BaseModel):
    name: str
    event_id: int
    quantity: Optional[int] = None
    stockLevel: Optional[str] = None
    dietaryTags: Optional[List[str]] = None
    description: Optional[str] = None
    pickup_instructions: Optional[str] = None


# Minimal Event model for the POST /event/ endpoint. Allow extra fields.
class Event(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None

    model_config = {"extra": "allow"}

if not url or not key:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in .env.local file")

supabase: Client = create_client(url, key)


def _extract_user_id_from_request(request: Optional[Request]) -> Optional[str]:
    """Try to extract a Supabase user id from an Authorization header on the request.
    This attempts to call the Supabase Python client helper if available; failures are swallowed.
    """
    if request is None:
        return None
    auth = None
    try:
        auth = request.headers.get("authorization") or request.headers.get("Authorization")
    except Exception:
        auth = None

    if not auth:
        return None

    parts = auth.split()
    if len(parts) != 2:
        return None
    scheme, token = parts[0].lower(), parts[1]
    if scheme != "bearer":
        return None

    # Try to use Supabase client to get the user associated with this token.
    try:
        # supabase-python has varied APIs across versions; try common ones.
        user_info = None
        try:
            user_info = supabase.auth.get_user(token)
        except Exception:
            try:
                # alternate signature
                user_info = supabase.auth.get_user(access_token=token)
            except Exception:
                user_info = None

        # user_info may be a dict or a response-like object
        if user_info is None:
            return None

        # Try common locations for the id
        if isinstance(user_info, dict):
            # e.g. {'data': {'user': {'id': '...'}}}
            data = user_info.get('data')
            if isinstance(data, dict):
                user = data.get('user') or data
                if isinstance(user, dict) and user.get('id'):
                    return user.get('id')

            # fallback top-level
            if user_info.get('user') and isinstance(user_info.get('user'), dict):
                return user_info['user'].get('id')
            if user_info.get('id'):
                return user_info.get('id')

        # Try attribute access (response-like objects)
        try:
            maybe_user = getattr(user_info, 'user', None) or getattr(user_info, 'data', None)
            if isinstance(maybe_user, dict) and maybe_user.get('id'):
                return maybe_user.get('id')
            if hasattr(user_info, 'id'):
                return getattr(user_info, 'id')
        except Exception:
            pass
    except Exception:
        return None

    return None

@app.get("/")
async def root():
    response = supabase.table('Events').select('*').execute()
    data = getattr(response, 'data', None) or (response.get('data') if isinstance(response, dict) else None) or []
    return {"data": data}

@app.get("/search/name/{name}")
async def search_by_name(name: str):
    response = supabase.table('Events').select('*').text_search("name", name, options={"config": "english"}).execute()
    data = getattr(response, 'data', None) or (response.get('data') if isinstance(response, dict) else None) or []
    return {"data": data}

@app.get("/search/food/{food}")
async def search_by_food(food: str):
    response = supabase.table('Events').select('*').contains("food", [food]).execute()
    data = getattr(response, 'data', None) or (response.get('data') if isinstance(response, dict) else None) or []
    return {"data": data}


@app.get("/search/dietary")
async def search_by_dietary(tags: str = ""):
    """
    Search events by dietary tags.
    Query parameter 'tags' should be comma-separated dietary tags (e.g., 'vegetarian,vegan')
    Returns events that have at least one food item with any of the specified dietary tags.
    """
    print(f"\n[DEBUG] /search/dietary called with tags: '{tags}'")
    
    if not tags:
        # If no tags specified, return all events
        response = supabase.table('Events').select('*').execute()
        data = getattr(response, 'data', None) or (response.get('data') if isinstance(response, dict) else None) or []
        return {"data": data}
    
    try:
        # Parse the tags from query string
        tag_list = [tag.strip().lower() for tag in tags.split(',') if tag.strip()]
        print(f"[DEBUG] Parsed tag_list: {tag_list}")
        
        if not tag_list:
            response = supabase.table('Events').select('*').execute()
            data = getattr(response, 'data', None) or (response.get('data') if isinstance(response, dict) else None) or []
            return {"data": data}
        
        # Get all events
        events_response = supabase.table('Events').select('*').execute()
        events_data = getattr(events_response, 'data', None) or (events_response.get('data') if isinstance(events_response, dict) else None) or []
        print(f"[DEBUG] Total events: {len(events_data)}")
        
        # Get all food items
        food_response = supabase.table('Food').select('*').execute()
        food_data = getattr(food_response, 'data', None) or (food_response.get('data') if isinstance(food_response, dict) else None) or []
        print(f"[DEBUG] Total food items: {len(food_data)}")
        
        # Build a map of event_id to food items
        event_food_map = {}
        for food in food_data:
            event_id = food.get('event_id')
            if event_id not in event_food_map:
                event_food_map[event_id] = []
            event_food_map[event_id].append(food)
            
            # Debug: print each food item's dietary tags
            dietary_tags = food.get('dietaryTags', []) or []
            print(f"[DEBUG] Food '{food.get('name')}' (event_id={event_id}): dietaryTags = {dietary_tags} (type: {type(dietary_tags).__name__})")
        
        # Filter events that have food items with any of the specified dietary tags
        filtered_events = []
        for event in events_data:
            event_id = event.get('id')
            foods = event_food_map.get(event_id, [])
            
            print(f"[DEBUG] Processing event {event_id} '{event.get('name')}': has {len(foods)} food items")
            
            # Check if any food item has any of the selected dietary tags
            has_matching_tag = False
            for food in foods:
                dietary_tags = food.get('dietaryTags', []) or []
                
                # Normalize dietary tags to lowercase for comparison
                normalized_tags = []
                if isinstance(dietary_tags, list):
                    normalized_tags = [str(tag).lower() for tag in dietary_tags]
                elif isinstance(dietary_tags, str):
                    normalized_tags = [tag.strip().lower() for tag in dietary_tags.split(',')]
                
                print(f"[DEBUG]   Food '{food.get('name')}': normalized_tags={normalized_tags}, searching for {tag_list}")
                
                # Check if any of the search tags are in this food item's tags
                if any(tag in normalized_tags for tag in tag_list):
                    print(f"[DEBUG]   ✓ MATCH FOUND!")
                    has_matching_tag = True
                    break
            
            if has_matching_tag:
                print(f"[DEBUG] Including event {event_id} in results")
                filtered_events.append(event)
        
        print(f"[DEBUG] Final result: {len(filtered_events)} events")
        return {"data": filtered_events}
    except Exception as e:
        print(f"Error in search_by_dietary: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@app.get("/events/{event_id}/food")
async def get_food_by_event(event_id: int):
    """Return food items associated with a given event_id from the Food table."""
    try:
        resp = supabase.table('Food').select('*').eq('event_id', event_id).execute()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    # Normalize response structure (supabase client may return object with .data or a dict)
    data = None
    if isinstance(resp, dict):
        data = resp.get('data')
    else:
        data = getattr(resp, 'data', None)

    if data is None:
        # If supabase returned an unexpected format, return empty list
        return {"data": []}

    if len(data) == 0:
        # Explicit 404 might be desired, but returning empty list is also acceptable
        return {"data": []}

    return {"data": data}

@app.post("/event/")
async def add_event(
    name: str = Form(...),
    description: str = Form(...),
    organization: str = Form(default=""),
    location: str = Form(...),
    campus_location: str = Form(default=""),
    date: str = Form(...),
    start_time: str = Form(...),
    end_time: str = Form(...),
    food: str = Form(default="[]"),
    image: Optional[UploadFile] = File(None)
):
    """
    Create a new event with optional image upload.
    - Uploads image to 'event_images' storage bucket if provided
    - Stores the public image URL in events table
    - Parses food as JSON array of food item names
    """
    try:
        # Parse food JSON
        food_items = []
        if food:
            try:
                food_items = json.loads(food)
            except json.JSONDecodeError:
                food_items = []
        
        image_url = None
        
        # Handle image upload if provided
        if image and image.filename:
            try:
                # Read the file content
                file_content = await image.read()
                
                # Upload to Supabase storage bucket 'event_images'
                # Generate a unique filename
                import uuid
                unique_filename = f"{uuid.uuid4()}_{image.filename}"
                
                # Upload to storage
                upload_response = supabase.storage.from_('event images').upload(
                    path=unique_filename,
                    file=file_content,
                    file_options={"content-type": image.content_type}
                )
                
                # Get the public URL
                image_url = supabase.storage.from_('event images').get_public_url(unique_filename)
                
            except Exception as e:
                # Log the error but don't fail the event creation
                print(f"Error uploading image: {str(e)}")
                image_url = None
        
        # Build event payload
        payload = {
            "name": name,
            "description": description,
            "organization": organization,
            "location": location,
            "campus_location": campus_location,
            "date": date,
            "start_time": start_time,
            "end_time": end_time,
            "food": food_items,
        }
        
        # Add image_url if upload succeeded
        if image_url:
            payload["image_url"] = image_url
        
        # Insert event into database
        response = supabase.table('Events').insert(payload).execute()
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating event: {str(e)}"
        )

@app.post("/food/")
async def add_food_items(food_items: List[FoodItem]):
    """
    Add multiple food items to the Food table.
    Expects a list of food items, each with name, event_id, and optional quantity/stockLevel/dietaryTags/description/pickup_instructions.
    """
    try:
        if not food_items or len(food_items) == 0:
            return {"status": "no items to insert", "inserted": []}
        
        # Convert Pydantic models to dicts
        items_to_insert = [item.model_dump(exclude_none=True) for item in food_items]
        
        # Insert all items
        response = supabase.table('Food').insert(items_to_insert).execute()
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error adding food items: {str(e)}"
        )

@app.put("/reserve/")
async def reserve_item(reserve: ReserveRequest, request: Request):
    # fetch current quantity and stockLevel
    try:
        q_resp = supabase.table('Food').select('quantity, stockLevel').eq("id", reserve.food_id).execute()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    # supabase client may return an object with .data or a dict with 'data'
    data = None
    if isinstance(q_resp, dict):
        data = q_resp.get('data')
    else:
        data = getattr(q_resp, 'data', None)

    if not data or len(data) == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Food item not found")

    row = data[0] if isinstance(data[0], dict) else data[0]

    # Try to extract quantity and stock level
    current_qty = None
    try:
        current_qty = row.get('quantity') if isinstance(row, dict) else row['quantity']
    except Exception:
        current_qty = None

    stock_level = None
    try:
        stock_level = row.get('stockLevel') if isinstance(row, dict) else row['stockLevel']
    except Exception:
        stock_level = None

    # If quantity is missing, derive an initial count from stock level
    # high => treated as unlimited (do not decrement quantity on reserve)
    # medium => 30, low => 7
    derived_from_stock = False
    if current_qty is None:
        if stock_level == StockLevel.HIGH.value or stock_level == StockLevel.HIGH:
            # unlimited: accept reservation but do not change quantity
            try:
                # return a simple success response (no DB update required)
                return {"status": "ok", "unlimited": True}
            except Exception as e:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
        elif stock_level == StockLevel.MEDIUM.value or stock_level == StockLevel.MEDIUM:
            current_qty = 30
            derived_from_stock = True
        elif stock_level == StockLevel.LOW.value or stock_level == StockLevel.LOW:
            current_qty = 7
            derived_from_stock = True
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Current quantity missing and stock level unavailable")

    # ensure we have a numeric quantity now
    try:
        current_qty = int(current_qty)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Invalid current quantity")

    new_qty = current_qty - reserve.quantity
    if new_qty < 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not enough stock to reserve requested quantity")

    # determine new stock level based on remaining quantity
    new_stock = None
    if new_qty > 30:
        new_stock = StockLevel.HIGH.value
    elif new_qty >= 8:
        new_stock = StockLevel.MEDIUM.value
    elif new_qty >= 1:
        new_stock = StockLevel.LOW.value
    else:
        # sold out -> set quantity to 0 and keep low to indicate empty/low
        new_stock = StockLevel.LOW.value

    try:
        update_resp = supabase.table('Food').update({'quantity': new_qty, 'stockLevel': new_stock}).eq("id", reserve.food_id).execute()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    profile_update_resp = None
    # Prefer user id from Authorization header (Supabase access token)
    profile_id_to_use = reserve.profile_id
    try:
        auth_header = reserve.__dict__.get('profile_id')  # placeholder to keep flake usage
    except Exception:
        auth_header = None
    # Attempt to get user id from request context via dependency injection is not available here
    # We'll try to read from an Authorization header using the FastAPI Request if present in the global scope
    # NOTE: To access the request, callers should pass it; we will attempt to read from a thread-local if available.
    # For now, if a real Authorization header is provided, frontend should include it and we'll extract server-side below.

    # If profile_id provided in body, use it (fallback). If Authorization header present in incoming HTTP request,
    # prefer the user id extracted from that token. We'll attempt to extract via the Supabase auth client if possible.
    # Attempt to extract a verified user id from the incoming Authorization header.
    token_user_id = _extract_user_id_from_request(request)
    if token_user_id:
        profile_id_to_use = token_user_id

    # If caller provided a profile id (and no token user id), append this food id to their reserved_items array
    if profile_id_to_use:
        try:
            p_resp = supabase.table('profiles').select('reserved_items').eq('id', profile_id_to_use).single().execute()
        except Exception as e:
            # Log a warning but do not fail the main reservation if profile lookup fails
            p_resp = None

        # normalize profile response
        p_data = None
        if isinstance(p_resp, dict):
            p_data = p_resp.get('data')
        elif p_resp is not None:
            p_data = getattr(p_resp, 'data', None)

        existing_list = []
        if p_data:
            # single() returns a single object, not a list
            # depending on client version, `.data` may be the row or a list; handle both
            row = None
            if isinstance(p_data, list) and len(p_data) > 0:
                row = p_data[0]
            elif isinstance(p_data, dict):
                row = p_data

            if row is not None:
                try:
                    existing_list = row.get('reserved_items') if isinstance(row, dict) else row['reserved_items']
                except Exception:
                    existing_list = []

        if existing_list is None:
            existing_list = []

        # Ensure we have a Python list
        if not isinstance(existing_list, list):
            existing_list = list(existing_list) if existing_list is not None else []

        # Append the food id if not already present
        str_food_id = str(reserve.food_id)
        if str_food_id not in [str(x) for x in existing_list]:
            existing_list.append(reserve.food_id)
            try:
                profile_update_resp = supabase.table('profiles').update({'reserved_items': existing_list}).eq('id', profile_id_to_use).execute()
            except Exception as e:
                # Do not fail the reservation if profile update fails; include info in response
                profile_update_resp = {'error': str(e)}

    return {"food_update": update_resp, "profile_update": profile_update_resp}


class CancelReserveRequest(BaseModel):
    food_id: int
    quantity: int = Field(..., gt=0)
    profile_id: Optional[str] = None


@app.post("/reserve/cancel")
async def cancel_reservation(req: CancelReserveRequest, request: Request):
    """Cancel a reservation: remove food_id from profile.reserved_items and increment Food.quantity."""
    # First, remove from profile if provided
    profile_update_resp = None
    # Prefer token-derived user id if available; fallback to provided profile_id
    token_user = _extract_user_id_from_request(request)
    profile_id_for_action = token_user or req.profile_id

    if profile_id_for_action:
        try:
            # Fetch current reserved_items
            p_resp = supabase.table('profiles').select('reserved_items').eq('id', profile_id_for_action).single().execute()
        except Exception:
            p_resp = None

        p_data = None
        if isinstance(p_resp, dict):
            p_data = p_resp.get('data')
        elif p_resp is not None:
            p_data = getattr(p_resp, 'data', None)

        existing_list = []
        if p_data:
            row = None
            if isinstance(p_data, list) and len(p_data) > 0:
                row = p_data[0]
            elif isinstance(p_data, dict):
                row = p_data
            if row is not None:
                try:
                    existing_list = row.get('reserved_items') if isinstance(row, dict) else row['reserved_items']
                except Exception:
                    existing_list = []

        if not existing_list:
            existing_list = []

        # Normalize
        if existing_list is None:
            existing_list = []
        if not isinstance(existing_list, list):
            existing_list = list(existing_list) if existing_list is not None else []

        # Remove the food id (match as string or number)
        new_list = [x for x in existing_list if str(x) != str(req.food_id)]
        try:
            profile_update_resp = supabase.table('profiles').update({'reserved_items': new_list}).eq('id', profile_id_for_action).execute()
        except Exception as e:
            profile_update_resp = {'error': str(e)}

    # Next, increment food quantity back (if quantity field exists on row)
    food_update_resp = None
    try:
        q_resp = supabase.table('Food').select('quantity, stockLevel').eq('id', req.food_id).execute()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    data = None
    if isinstance(q_resp, dict):
        data = q_resp.get('data')
    else:
        data = getattr(q_resp, 'data', None)

    if not data or len(data) == 0:
        # Food not found; still return profile update result
        return {'profile_update': profile_update_resp, 'food_update': None}

    row = data[0] if isinstance(data[0], dict) else data[0]
    current_qty = None
    try:
        current_qty = row.get('quantity') if isinstance(row, dict) else row['quantity']
    except Exception:
        current_qty = None

    # If quantity is None (unlimited), do not change
    if current_qty is None:
        return {'profile_update': profile_update_resp, 'food_update': {'status': 'unlimited'}}

    try:
        new_qty = int(current_qty) + req.quantity
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='Invalid quantity on food row')

    # recompute stockLevel
    if new_qty > 30:
        new_stock = StockLevel.HIGH.value
    elif new_qty >= 8:
        new_stock = StockLevel.MEDIUM.value
    elif new_qty >= 1:
        new_stock = StockLevel.LOW.value
    else:
        new_stock = StockLevel.LOW.value

    try:
        food_update_resp = supabase.table('Food').update({'quantity': new_qty, 'stockLevel': new_stock}).eq('id', req.food_id).execute()
    except Exception as e:
        food_update_resp = {'error': str(e)}

    return {'profile_update': profile_update_resp, 'food_update': food_update_resp}


@app.get('/profiles/{profile_id}/reservations')
async def get_profile_reservations(profile_id: str, request: Request):
    """Return a list of reserved food ids for the profile and the food rows for those items."""
    # If caller used the special `me` identifier, try to resolve from the Authorization header.
    if profile_id in ("me", "self"):
        token_user = _extract_user_id_from_request(request)
        if token_user:
            profile_id = token_user

    try:
        p_resp = supabase.table('profiles').select('reserved_items').eq('id', profile_id).execute()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    p_data = None
    if isinstance(p_resp, dict):
        p_data = p_resp.get('data')
    else:
        p_data = getattr(p_resp, 'data', None)

    if not p_data:
        return {'reserved_items': [], 'food_rows': []}

    row = None
    if isinstance(p_data, list) and len(p_data) > 0:
        row = p_data[0]
    elif isinstance(p_data, dict):
        row = p_data

    if not row:
        return {'reserved_items': [], 'food_rows': []}

    reserved = row.get('reserved_items') if isinstance(row, dict) else row['reserved_items']
    if not reserved:
        return {'reserved_items': [], 'food_rows': []}

    # fetch food rows
    try:
        f_resp = supabase.table('Food').select('*').in_('id', reserved).execute()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    f_data = None
    if isinstance(f_resp, dict):
        f_data = f_resp.get('data')
    else:
        f_data = getattr(f_resp, 'data', None)

    return {'reserved_items': reserved, 'food_rows': f_data or []}


#statistics for home page
@app.get("/stats")
async def get_stats():
    """
    Calculate dashboard statistics from the database
    """
    try:
        # Events Tracked 
        events_resp = supabase.table('Events').select('*', count='exact').execute()
        total_events = events_resp.count or 0
        
        # Food Items Saved
        food_resp = supabase.table('Food').select('*', count='exact').execute()
        total_food_items = food_resp.count or 0
        
        # Active Users
        profiles_resp = supabase.table('profiles').select('*', count='exact').execute()
        active_users = profiles_resp.count or 0
        
        # Pounds Rescued
        total_pounds = total_food_items * 5
        
        stats = {
            "total_events": total_events,
            "total_food_saved": total_food_items,
            "active_users": active_users,
            "total_pounds_rescued": total_pounds
        }
        
        return {"data": stats}
        
    except Exception as e:
        print(f"Error calculating stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calculating stats: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
