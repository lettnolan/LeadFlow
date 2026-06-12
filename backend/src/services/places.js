const PLACES_BASE = 'https://maps.googleapis.com/maps/api/place';
const KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function searchBusinesses(query, location) {
  const searchQuery = `${query} in ${location}`;
  const url = new URL(`${PLACES_BASE}/textsearch/json`);
  url.searchParams.set('query', searchQuery);
  url.searchParams.set('type', 'establishment');
  url.searchParams.set('key', KEY);

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Places API error: ${data.status} - ${data.error_message || ''}`);
  }

  const places = data.results || [];
  const detailed = await Promise.all(places.slice(0, 20).map(p => getPlaceDetails(p.place_id)));
  return detailed.filter(Boolean);
}

async function getPlaceDetails(placeId) {
  const url = new URL(`${PLACES_BASE}/details/json`);
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,types');
  url.searchParams.set('key', KEY);

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== 'OK') return null;
  return data.result;
}
