import os
import dotenv
from supabase import create_client

dotenv.load_dotenv(dotenv_path='.env.local')

url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
key = os.getenv('NEXT_PUBLIC_SUPABASE_KEY')

if not url or not key:
    print('ERROR: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_KEY must be set in .env.local')
    raise SystemExit(1)

supabase = create_client(url, key)

# Fetch existing Events to attach food items to
print('Querying existing events...')
ev_resp = supabase.table('Events').select('id').execute()
ev_data = getattr(ev_resp, 'data', ev_resp) or []
existing_event_ids = []
for row in ev_data:
    if isinstance(row, dict):
        eid = row.get('id')
    else:
        eid = getattr(row, 'id', None)
    if eid is not None:
        existing_event_ids.append(eid)

if not existing_event_ids:
    print('No Events found in the DB. Please create Events first before inserting Food rows.')
    raise SystemExit(1)

# Sample food items attached to the first two existing events (or only one if only one exists)
foods = []
if len(existing_event_ids) >= 1:
    foods += [
        {'name': 'Cheese Pizza', 'quantity': 12, 'dietaryTags': ['vegetarian'], 'description': 'Large slices', 'event_id': existing_event_ids[0]},
        {'name': 'Vegetable Samosa', 'quantity': 30, 'dietaryTags': ['vegan'], 'description': 'Fried snacks', 'event_id': existing_event_ids[0]},
        {'name': 'Orange Juice', 'stockLevel': 'high', 'dietaryTags': ['vegan'], 'description': 'Pitcher', 'event_id': existing_event_ids[0]},
    ]

if len(existing_event_ids) >= 2:
    foods += [
        {'name': 'Plain Bagel', 'quantity': 20, 'dietaryTags': ['vegetarian'], 'description': 'With cream cheese', 'event_id': existing_event_ids[1]},
        {'name': 'Coffee', 'stockLevel': 'high', 'dietaryTags': ['vegan'], 'description': 'Regular and decaf', 'event_id': existing_event_ids[1]},
    ]

print('Inserting food rows...')
food_resp = supabase.table('Food').insert(foods).execute()
print('Food insert response:', getattr(food_resp, 'data', food_resp))

print('Seed complete.')
