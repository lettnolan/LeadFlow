import { Router } from 'express';
import { searchBusinesses } from '../services/places.js';
import { checkWebsite } from '../services/websiteChecker.js';
import { checkSearchQuota } from '../middleware/quota.js';

const router = Router();

router.post('/search', checkSearchQuota, async (req, res) => {
  const { niche, location } = req.body;
  if (!niche || !location) {
    return res.status(400).json({ error: 'niche and location are required' });
  }

  try {
    const businesses = await searchBusinesses(niche, location);

    const leads = await Promise.all(
      businesses.map(async (biz) => {
        const websiteResult = await checkWebsite(biz.website);
        return {
          id: Math.random().toString(36).slice(2),
          name: biz.name,
          address: biz.formatted_address,
          phone: biz.formatted_phone_number || null,
          website: biz.website || null,
          rating: biz.rating || null,
          reviewCount: biz.user_ratings_total || 0,
          websiteStatus: websiteResult.status,
          opportunityScore: websiteResult.score,
        };
      })
    );

    // Sort: high opportunity first
    const order = { high: 0, medium: 1, low: 2 };
    leads.sort((a, b) => (order[a.opportunityScore] ?? 3) - (order[b.opportunityScore] ?? 3));

    res.json({ leads, total: leads.length });
  } catch (err) {
    console.error('Lead search error:', err);
    res.status(500).json({ error: err.message || 'Search failed' });
  }
});

export default router;
