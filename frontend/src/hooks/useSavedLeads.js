import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.js';

export function useSavedLeads(userId) {
  const [savedLeads, setSavedLeads] = useState([]);
  const [savedLeadIds, setSavedLeadIds] = useState(new Set());

  useEffect(() => {
    if (userId) fetchSavedLeads();
  }, [userId]);

  async function fetchSavedLeads() {
    const { data } = await supabase
      .from('saved_leads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (data) {
      setSavedLeads(data);
      setSavedLeadIds(new Set(data.map(l => l.lead_id)));
    }
  }

  async function toggleSave(lead) {
    if (savedLeadIds.has(lead.id)) {
      // Unsave
      await supabase
        .from('saved_leads')
        .delete()
        .eq('user_id', userId)
        .eq('lead_id', lead.id);
      setSavedLeadIds(prev => { const s = new Set(prev); s.delete(lead.id); return s; });
      setSavedLeads(prev => prev.filter(l => l.lead_id !== lead.id));
    } else {
      // Save
      const row = {
        user_id: userId,
        lead_id: lead.id,
        name: lead.name,
        address: lead.address,
        phone: lead.phone,
        website: lead.website,
        website_status: lead.websiteStatus,
        opportunity_score: lead.opportunityScore,
        rating: lead.rating,
        review_count: lead.reviewCount,
      };
      await supabase.from('saved_leads').insert(row);
      setSavedLeadIds(prev => new Set(prev).add(lead.id));
      setSavedLeads(prev => [row, ...prev]);
    }
  }

  return { savedLeads, savedLeadIds, toggleSave, refetch: fetchSavedLeads };
}
