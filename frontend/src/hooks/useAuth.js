import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('plan, searches_used_this_month, last_reset_date')
      .eq('id', userId)
      .single();
    setProfile(data);
    setLoading(false);
  }

  async function refreshProfile() {
    if (!user) return;
    await fetchProfile(user.id);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const FREE_LIMIT = 2;
  const searchesUsed = profile?.searches_used_this_month ?? 0;
  const isPro = profile?.plan === 'pro';
  const searchesRemaining = isPro ? Infinity : Math.max(0, FREE_LIMIT - searchesUsed);
  const limitReached = !isPro && searchesUsed >= FREE_LIMIT;

  return { user, profile, loading, signOut, refreshProfile, searchesUsed, searchesRemaining, isPro, limitReached, FREE_LIMIT };
}
