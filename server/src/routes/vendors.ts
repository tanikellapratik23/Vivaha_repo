import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Vendor from '../models/Vendor';
import axios from 'axios';

const router = Router();
const osmCache = new Map<string, { expiresAt: number; businesses: any[] }>();

const categoryImages: Record<string, string> = {
  Photography: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=900&q=80',
  Venue: 'https://images.unsplash.com/photo-1519167271-5d9b8c24e46c?auto=format&fit=crop&w=900&q=80',
  DJ: 'https://images.unsplash.com/photo-1571266028243-d220c9c3b2fd?auto=format&fit=crop&w=900&q=80',
  Catering: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80',
  Flowers: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80',
};

const osmFilters: Record<string, string[]> = {
  Photography: ['["shop"="photo"]', '["craft"="photographer"]', '["name"~"photo|photography",i]'],
  Venue: ['["amenity"="events_venue"]', '["amenity"="community_centre"]', '["tourism"="hotel"]', '["name"~"event|wedding|ballroom",i]'],
  DJ: ['["amenity"="nightclub"]', '["amenity"="music_venue"]', '["name"~"dj|music",i]'],
  Catering: ['["amenity"="restaurant"]', '["amenity"="cafe"]', '["shop"="deli"]', '["name"~"catering|caterer",i]'],
  Flowers: ['["shop"="florist"]', '["name"~"flower|floral",i]'],
};

async function searchOpenStreetMap(city: string, state: string, category: string) {
  const cacheKey = `${city}|${state}|${category}`.toLowerCase();
  const cached = osmCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.businesses;

  const geocode = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: { q: `${city}, ${state}`, format: 'jsonv2', limit: 1 },
    headers: { 'User-Agent': 'Vivaha wedding planner vendor discovery' },
    timeout: 8000,
  });
  const place = geocode.data?.[0];
  if (!place) return [];
  const filters = osmFilters[category] || [];
  if (!filters.length) return [];
  const query = `[out:json][timeout:15];(${filters.map((filter) => `nwr${filter}(around:18000,${place.lat},${place.lon});`).join('')});out center tags 30;`;
  const overpass = await axios.post('https://overpass-api.de/api/interpreter', query, {
    headers: { 'Content-Type': 'text/plain', 'User-Agent': 'Vivaha wedding planner vendor discovery' },
    timeout: 20000,
  });
  const seen = new Set<string>();
  const businesses = (overpass.data?.elements || [])
    .map((item: any) => {
      const tags = item.tags || {};
      const name = tags.name?.trim();
      if (!name || seen.has(name.toLowerCase())) return null;
      seen.add(name.toLowerCase());
      const address = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' ');
      return {
        id: `osm-${item.type}-${item.id}`,
        name,
        categories: [{ title: category }],
        location: { city: tags['addr:city'] || city, state: tags['addr:state'] || state, address1: address },
        display_phone: tags.phone || tags['contact:phone'] || '',
        url: tags.website || tags['contact:website'] || '',
        image_url: categoryImages[category],
        source: 'openstreetmap',
      };
    })
    .filter(Boolean)
    .slice(0, 6);
  osmCache.set(cacheKey, { businesses, expiresAt: Date.now() + 60 * 60 * 1000 });
  return businesses;
}

// Proxy Yelp API search (to avoid CORS issues in frontend)
// Allow unauthenticated access for landing page preview, authenticated for dashboard
router.get('/search', async (req, res) => {
  try {
    const { city, state, category } = req.query;
    const YELP_API_KEY = process.env.YELP_API_KEY;

    if (!city || !state || !category) return res.status(400).json({ error: 'city, state, and category are required' });

    const categoryMap: { [key: string]: string } = {
      Photography: 'photographers',
      Venue: 'venues,eventspaces',
      DJ: 'djs',
      Officiant: 'officiants',
      Catering: 'caterers,catering',
      Flowers: 'florists',
      Planning: 'wedding_planning,eventplanners',
    };

    const yelpCategory = categoryMap[category as string] || 'wedding';
    const location = `${city}, ${state}`;

    if (!YELP_API_KEY) {
      const businesses = await searchOpenStreetMap(String(city), String(state), String(category));
      return res.json({ businesses, source: 'openstreetmap' });
    }

    const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`,
      },
      params: {
        location,
        term: `wedding ${yelpCategory}`,
        limit: 20,
        sort_by: 'rating',
      },
    });

    res.json({ ...response.data, source: 'yelp' });
  } catch (error: any) {
    console.error('Yelp API error:', error.response?.data || error.message);
    res.json({ businesses: [], source: 'unavailable' });
  }
});

// Google Places search stays server-side so the browser never receives the key.
router.post('/places-search', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { query, location } = req.body;
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) return res.status(503).json({ error: 'Google Places is not configured yet.' });
    const response = await axios.post('https://places.googleapis.com/v1/places:searchText', {
      textQuery: `${query || 'wedding vendors'} near ${location || 'Morrisville, NC'}`,
      pageSize: 12,
    }, { headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.nationalPhoneNumber,places.websiteUri,places.photos' } });
    res.json({ places: (response.data.places || []).map((place: any) => ({ id: place.id, name: place.displayName?.text, address: place.formattedAddress, rating: place.rating, reviews: place.userRatingCount, phone: place.nationalPhoneNumber, website: place.websiteUri, image: place.photos?.[0]?.name ? `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxHeightPx=500&maxWidthPx=700&key=${key}` : null })) });
  } catch (error: any) {
    console.error('Google Places search error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Unable to search Google Places.' });
  }
});

// Get all vendors
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const vendors = await Vendor.find({ userId: req.userId });
    res.json({ success: true, data: vendors });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

// Create vendor
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const vendor = new Vendor({
      userId: req.userId,
      ...req.body,
    });
    await vendor.save();
    res.status(201).json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create vendor' });
  }
});

// Update vendor
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vendor' });
  }
});

// Delete vendor
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const vendor = await Vendor.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json({ success: true, message: 'Vendor deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete vendor' });
  }
});

export default router;
