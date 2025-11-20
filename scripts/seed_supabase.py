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

# Create 10 sample events and insert multiple food items for each event
print('Creating 10 sample Events...')
events = []
from datetime import datetime, timedelta

base_date = datetime.utcnow()
for i in range(1, 11):
    events.append({
        'name': f'Sample Event {i}',
        'description': f'This is sample event number {i}',
        'date': (base_date + timedelta(days=i)).isoformat(),
    })

ev_resp = supabase.table('Events').insert(events).execute()
ev_data = getattr(ev_resp, 'data', ev_resp) or []
inserted_event_ids = []
for row in ev_data:
    if isinstance(row, dict):
        eid = row.get('id')
    else:
        eid = getattr(row, 'id', None)
    if eid is not None:
        inserted_event_ids.append(eid)

if not inserted_event_ids:
    print('Failed to insert events or no event IDs returned. Response:', ev_resp)
    raise SystemExit(1)

print(f'Inserted {len(inserted_event_ids)} events. Creating food rows for each event...')

foods = []
sample_foods = [
    { 'name': 'Cheese Pizza', 'quantity': 12, 'dietaryTags': ['vegetarian'], 'description': 'Large slices' },
    { 'name': 'Vegetable Samosa', 'quantity': 30, 'dietaryTags': ['vegan'], 'description': 'Fried snacks' },
    { 'name': 'Orange Juice', 'stockLevel': 'high', 'dietaryTags': ['vegan'], 'description': 'Pitcher' },
    { 'name': 'Plain Bagel', 'quantity': 20, 'dietaryTags': ['vegetarian'], 'description': 'With cream cheese' },
    { 'name': 'Coffee', 'stockLevel': 'high', 'dietaryTags': ['vegan'], 'description': 'Regular and decaf' },
    { 'name': 'Sourdough Sandwich', 'quantity': 10, 'dietaryTags': [], 'description': 'Ham & cheese option' },
    { 'name': 'Fruit Salad', 'quantity': 15, 'dietaryTags': ['vegan', 'gluten-free'], 'description': 'Seasonal fruits' },
]

for eid in inserted_event_ids:
    # create 3-5 food rows per event, rotate through sample_foods
    import random
    count = random.randint(3, 5)
    choices = random.sample(sample_foods, k=count)
    for f in choices:
        row = f.copy()
        row['event_id'] = eid
        foods.append(row)

print(f'Inserting {len(foods)} food rows...')
food_resp = supabase.table('Food').insert(foods).execute()
print('Food insert response:', getattr(food_resp, 'data', food_resp))

print('Seed complete.')
