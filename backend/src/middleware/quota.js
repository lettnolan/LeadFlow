import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const FREE_LIMIT = Number(process.env.FREE_SEARCH_LIMIT) || 2;

export async function checkSearchQuota(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required', authRequired: true });
  }

  const token = authHeader.slice(7);

  // Verify the user's JWT with Supabase
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid or expired session', authRequired: true });
  }

  // Fetch their profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('plan, searches_used_this_month, last_reset_date')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return res.status(500).json({ error: 'Profile not found' });
  }

  // Pro users skip quota
  if (profile.plan === 'pro') {
    req.userId = user.id;
    req.userPlan = 'pro';
    return next();
  }

  // Reset counter if we're in a new month
  const today = new Date().toISOString().slice(0, 10);
  const lastReset = profile.last_reset_date;
  const currentMonth = today.slice(0, 7);
  const lastResetMonth = lastReset.slice(0, 7);

  let searchesUsed = profile.searches_used_this_month;
  if (lastResetMonth !== currentMonth) {
    searchesUsed = 0;
    await supabase
      .from('profiles')
      .update({ searches_used_this_month: 0, last_reset_date: today })
      .eq('id', user.id);
  }

  if (searchesUsed >= FREE_LIMIT) {
    return res.status(429).json({
      error: 'Free search limit reached',
      upgradeRequired: true,
      limit: FREE_LIMIT,
      used: searchesUsed,
    });
  }

  // Increment counter
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      searches_used_this_month: searchesUsed + 1,
      last_reset_date: today,
    })
    .eq('id', user.id);

  if (updateError) {
    return res.status(500).json({ error: 'Failed to update search count' });
  }

  req.userId = user.id;
  req.userPlan = 'free';
  res.setHeader('X-Searches-Used', searchesUsed + 1);
  res.setHeader('X-Searches-Limit', FREE_LIMIT);
  next();
}
