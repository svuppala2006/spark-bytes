import urllib.request
import urllib.parse
import json
import sys

BASE = 'http://127.0.0.1:8000'

def req(path, method='GET', body=None):
    url = BASE + path
    data = None
    headers = {}
    if body is not None:
        data = json.dumps(body).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            raw = resp.read().decode('utf-8')
            try:
                return resp.getcode(), json.loads(raw)
            except Exception:
                return resp.getcode(), raw
    except urllib.error.HTTPError as e:
        try:
            body = e.read().decode('utf-8')
            return e.code, json.loads(body)
        except Exception:
            return e.code, str(e)
    except Exception as e:
        return None, str(e)


def pretty(obj):
    print(json.dumps(obj, indent=2, ensure_ascii=False))


def main():
    print('1) List events: GET /')
    code, events = req('/')
    print('HTTP', code)
    pretty(events)

    data = events.get('data') if isinstance(events, dict) else None
    if not data or len(data) == 0:
        print('No events found; aborting.')
        return
    ev = data[0]
    event_id = ev.get('id')
    print('\n2) List food for event', event_id)
    code, foods = req(f'/events/{event_id}/food')
    print('HTTP', code)
    pretty(foods)

    rows = foods.get('data') if isinstance(foods, dict) else None
    if not rows or len(rows) == 0:
        print('No food rows for event; aborting.')
        return

    # pick first food with numeric quantity
    chosen = None
    for r in rows:
        q = r.get('quantity')
        if q is not None:
            try:
                if int(q) > 0:
                    chosen = r
                    break
            except Exception:
                pass
    if chosen is None:
        chosen = rows[0]

    food_id = chosen.get('id')
    print('\nChosen food id:', food_id, 'name:', chosen.get('name'))

    test_profile = 'test-user-1'

    print('\n3) Reserve food (PUT /reserve/)')
    payload = { 'food_id': int(food_id), 'quantity': 1, 'profile_id': test_profile }
    code, resp = req('/reserve/', method='PUT', body=payload)
    print('HTTP', code)
    pretty(resp)

    print('\n4) Get profile reservations (GET /profiles/{id}/reservations)')
    code, prow = req(f'/profiles/{urllib.parse.quote(test_profile)}/reservations')
    print('HTTP', code)
    pretty(prow)

    print('\n5) Re-fetch food rows to see quantity change')
    code, foods2 = req(f'/events/{event_id}/food')
    print('HTTP', code)
    pretty(foods2)

    print('\n6) Cancel reservation (POST /reserve/cancel)')
    payload = { 'food_id': int(food_id), 'quantity': 1, 'profile_id': test_profile }
    code, cresp = req('/reserve/cancel', method='POST', body=payload)
    print('HTTP', code)
    pretty(cresp)

    print('\n7) Profile reservations after cancel')
    code, prow2 = req(f'/profiles/{urllib.parse.quote(test_profile)}/reservations')
    print('HTTP', code)
    pretty(prow2)

    print('\n8) Final food rows')
    code, foods3 = req(f'/events/{event_id}/food')
    print('HTTP', code)
    pretty(foods3)


if __name__ == '__main__':
    main()
