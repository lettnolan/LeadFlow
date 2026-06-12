import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth.js';
import { useSavedLeads } from './hooks/useSavedLeads.js';
import { supabase } from './lib/supabase.js';
import Header from './components/Header.jsx';
import SearchForm from './components/SearchForm.jsx';
import LeadGrid from './components/LeadGrid.jsx';
import LeadCard from './components/LeadCard.jsx';
import UpgradeModal from './components/UpgradeModal.jsx';
import AuthModal from './components/AuthModal.jsx';
import LandingPage from './components/LandingPage.jsx';

export default function App() {
  const { user, loading: authLoading, isPro, searchesUsed, limitReached, FREE_LIMIT, signOut, refreshProfile } = useAuth();
  const { savedLeads, savedLeadIds, toggleSave } = useSavedLeads(user?.id);

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'saved'

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('upgrade') === 'success') {
      setUpgradeSuccess(true);
      window.history.replaceState({}, '', '/');
      refreshProfile();
    }
  }, []);

  async function handleSearch({ niche, location }) {
    if (!user) { setShowAuth(true); return; }
    if (limitReached) { setShowUpgrade(true); return; }

    setLoading(true);
    setError(null);
    setLeads([]);
    setActiveTab('search');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch('/api/leads/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ niche, location }),
      });

      const data = await res.json();

      if (res.status === 401 && data.authRequired) { setShowAuth(true); return; }
      if (res.status === 429 && data.upgradeRequired) {
        await refreshProfile();
        setShowUpgrade(true);
        return;
      }
      if (!res.ok) throw new Error(data.error || 'Search failed');

      setLeads(data.leads);
      setSearched(true);
      await refreshProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-navy">
          <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="font-semibold">Loading LeadFlow...</span>
        </div>
      </div>
    );
  }

  // Show landing page to logged-out visitors
  if (!user) {
    return (
      <>
        <LandingPage onSignIn={() => setShowAuth(true)} />
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        user={user}
        isPro={isPro}
        searchesUsed={searchesUsed}
        freeLimit={FREE_LIMIT}
        onUpgrade={() => setShowUpgrade(true)}
        onSignIn={() => setShowAuth(true)}
        onSignOut={signOut}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {upgradeSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm flex items-center justify-between">
            <span>🎉 You're now on Pro — unlimited searches unlocked!</span>
            <button onClick={() => setUpgradeSuccess(false)} className="text-green-600 hover:text-green-800 ml-4">✕</button>
          </div>
        )}

        {user && !isPro && (
          <div className={`mb-4 rounded-lg px-4 py-2.5 text-sm flex items-center justify-between ${
            limitReached ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-navy/5 border border-navy/10 text-navy'
          }`}>
            <span>
              {limitReached ? "You've used all 2 free searches this month." : `${searchesUsed} of ${FREE_LIMIT} free searches used this month.`}
            </span>
            {limitReached && (
              <button onClick={() => setShowUpgrade(true)} className="ml-4 bg-gold text-navy font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-gold-dark transition-colors">
                Upgrade to Pro →
              </button>
            )}
          </div>
        )}

        {/* Tabs */}
        {user && (
          <div className="flex gap-1 mb-6 border-b border-gray-200">
            <TabButton active={activeTab === 'search'} onClick={() => setActiveTab('search')}>
              Search
            </TabButton>
            <TabButton active={activeTab === 'saved'} onClick={() => setActiveTab('saved')}>
              Saved Leads {savedLeads.length > 0 && <span className="ml-1.5 bg-navy text-white text-xs rounded-full px-1.5 py-0.5">{savedLeads.length}</span>}
            </TabButton>
          </div>
        )}

        {activeTab === 'search' && (
          <>
            <SearchForm onSearch={handleSearch} loading={loading} />

            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
            )}

            {loading && <LoadingSkeleton />}

            {!loading && searched && (
              <LeadGrid leads={leads} savedLeadIds={savedLeadIds} onToggleSave={user ? toggleSave : null} />
            )}

            {!loading && !searched && !error && <HeroBlurb onSignIn={() => setShowAuth(true)} user={user} />}
          </>
        )}

        {activeTab === 'saved' && (
          <SavedLeadsTab savedLeads={savedLeads} savedLeadIds={savedLeadIds} onToggleSave={toggleSave} />
        )}
      </main>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} userEmail={user?.email} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors -mb-px flex items-center ${
        active ? 'border-navy text-navy' : 'border-transparent text-gray-500 hover:text-navy'
      }`}
    >
      {children}
    </button>
  );
}

function SavedLeadsTab({ savedLeads, savedLeadIds, onToggleSave }) {
  if (savedLeads.length === 0) {
    return (
      <div className="mt-16 text-center text-gray-500">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy/10 mb-4">
          <svg className="w-8 h-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-navy">No saved leads yet</p>
        <p className="text-sm mt-1">Click the bookmark icon on any lead card to save it here.</p>
      </div>
    );
  }

  // Convert saved_leads DB rows back to lead card format
  const leads = savedLeads.map(l => ({
    id: l.lead_id,
    name: l.name,
    address: l.address,
    phone: l.phone,
    website: l.website,
    websiteStatus: l.website_status,
    opportunityScore: l.opportunity_score,
    rating: l.rating,
    reviewCount: l.review_count,
  }));

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">{savedLeads.length} saved lead{savedLeads.length !== 1 ? 's' : ''}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads.map(lead => (
          <LeadCard key={lead.id} lead={lead} saved={savedLeadIds?.has(lead.id)} onToggleSave={onToggleSave} />
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
          <div className="h-4 bg-gray-100 rounded w-full mb-2" />
          <div className="h-4 bg-gray-100 rounded w-2/3 mb-4" />
          <div className="h-8 bg-gray-200 rounded w-1/3" />
        </div>
      ))}
    </div>
  );
}

function HeroBlurb({ onSignIn, user }) {
  return (
    <div className="mt-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy/10 mb-4">
        <svg className="w-8 h-8 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-navy mb-2">Find Your Next Client</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        Enter a business niche and city above. LeadFlow scans Google Maps, scores
        each lead by web presence, and crafts a personalized outreach email — in seconds.
      </p>
      {!user && (
        <button onClick={onSignIn} className="bg-navy text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-navy-light transition-colors">
          Sign in to get started
        </button>
      )}
    </div>
  );
}
