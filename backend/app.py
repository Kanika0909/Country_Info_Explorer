from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import json
import time
import os

CACHE_FILE = 'cache.json'
CACHE_TTL = 60 * 60  # 1 hour
RESTCOUNTRIES_BASE = 'https://restcountries.com/v3.1'

app = Flask(__name__)
CORS(app)

# Ensure cache file exists
if not os.path.exists(CACHE_FILE):
    with open(CACHE_FILE, 'w') as f:
        json.dump({}, f)


def load_cache():
    with open(CACHE_FILE, 'r') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {}


def save_cache(cache):
    with open(CACHE_FILE, 'w') as f:
        json.dump(cache, f)


def get_from_cache(key):
    cache = load_cache()
    entry = cache.get(key)
    if not entry:
        return None

    # Check TTL
    if time.time() - entry.get('ts', 0) > CACHE_TTL:
        # Expired
        cache.pop(key, None)
        save_cache(cache)
        return None

    return entry.get('data')


def set_cache(key, data):
    cache = load_cache()
    cache[key] = {'ts': time.time(), 'data': data}
    save_cache(cache)


@app.route('/')
def health_check():
    return jsonify({'status': 'ok'})


@app.route('/api/countries')
def list_countries():
    q = request.args.get('q')
    region = request.args.get('region')

    # Build cache key
    cache_key = f'countries:q={q or ""}:region={region or ""}'
    cached = get_from_cache(cache_key)
    if cached is not None:
        return jsonify(cached)

    # Construct external API URL
    try:
        if q:
            # Search by name
            url = f"{RESTCOUNTRIES_BASE}/name/{q}"
        elif region:
            url = f"{RESTCOUNTRIES_BASE}/region/{region}"
        else:
            url = f"{RESTCOUNTRIES_BASE}/all"

        resp = requests.get(url, params={
            'fields': 'name,cca3,flags,population,region,capital'
        })
        resp.raise_for_status()
        data = resp.json()

    except requests.exceptions.HTTPError as e:
        return jsonify({'error': 'Not found or external API error', 'details': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'External API failure', 'details': str(e)}), 500

    # Save small projection to reduce size
    simplified = []
    for item in data:
        simplified.append({
            'name': item.get('name', {}).get('common'),
            'cca3': item.get('cca3'),
            'flag': item.get('flags', {}).get('png') or item.get('flags', {}).get('svg'),
            'population': item.get('population'),
            'region': item.get('region'),
            'capital': item.get('capital', [None])[0] if item.get('capital') else None,
        })

    set_cache(cache_key, simplified)
    return jsonify(simplified)


@app.route('/api/countries/<code>')
def country_detail(code):
    cache_key = f'country:{code.upper()}'
    cached = get_from_cache(cache_key)
    if cached is not None:
        return jsonify(cached)

    try:
        url = f"{RESTCOUNTRIES_BASE}/alpha/{code}"
        resp = requests.get(url)
        resp.raise_for_status()
        data = resp.json()
        if isinstance(data, list):
            data = data[0]
    except requests.exceptions.HTTPError as e:
        return jsonify({'error': 'Not found or external API error', 'details': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'External API failure', 'details': str(e)}), 500

    # Project useful fields
    result = {
        'name': data.get('name', {}).get('common'),
        'cca3': data.get('cca3'),
        'flag': data.get('flags', {}).get('png') or data.get('flags', {}).get('svg'),
        'population': data.get('population'),
        'region': data.get('region'),
        'subregion': data.get('subregion'),
        'capital': data.get('capital', [None])[0] if data.get('capital') else None,
        'languages': list(data.get('languages', {}).values()) if data.get('languages') else [],
        'currencies': [f"{v.get('name')} ({v.get('symbol')})" for v in data.get('currencies', {}).values()] if data.get('currencies') else [],
        'borders': data.get('borders', []),
        'latlng': data.get('latlng'),
    }

    set_cache(cache_key, result)
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
