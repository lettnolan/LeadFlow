import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Simple secret header guard — set ADMIN_SECRET in .env
function requireAdmin(req, res, next) {
  const secret = req.headers['x-admin-secret'];
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

// PATCH /api/admin/user-plan
// Body: { email, plan }  — plan is "free" or "pro"
router.patch('/user-plan', requireAdmin, async (req, res) => {
  const { email, plan } = req.body;
  if (!email || !['free', 'pro'].includes(plan)) {
    return res.status(400).json({ error: 'email and plan (free|pro) required' });
  }

  const { data, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) return res.status(500).json({ error: listError.message });

  const user = data.users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: `No user found for ${email}` });

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ plan })
    .eq('id', user.id);

  if (updateError) return res.status(500).json({ error: updateError.message });

  res.json({ ok: true, email, plan });
});

// GET /api/admin/users — list all users and their plans
router.get('/users', requireAdmin, async (req, res) => {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) return res.status(500).json({ error: error.message });

  const { data: profiles } = await supabase.from('profiles').select('id, plan, searches_used_this_month');
  const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p]));

  const users = data.users.map(u => ({
    email: u.email,
    id: u.id,
    plan: profileMap[u.id]?.plan ?? 'free',
    searches_used: profileMap[u.id]?.searches_used_this_month ?? 0,
    created_at: u.created_at,
  }));

  res.json({ users });
});

export default router;
