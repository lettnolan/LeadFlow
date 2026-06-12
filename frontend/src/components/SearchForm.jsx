import { useState } from 'react';

export default function SearchForm({ onSearch, loading }) {
  const [niche, setNiche] = useState('');
  const [location, setLocation] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!niche.trim() || !location.trim()) return;
    onSearch({ niche: niche.trim(), location: location.trim() });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h1 className="text-xl font-bold text-navy mb-1">Find High-Opportunity Leads</h1>
      <p className="text-sm text-gray-500 mb-5">
        Search for local businesses missing a strong web presence.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
            Business Niche
          </label>
          <input
            type="text"
            value={niche}
            onChange={e => setNiche(e.target.value)}
            placeholder="e.g. auto detailers, plumbers, nail salons"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/40 focus:border-navy"
            disabled={loading}
          />
        </div>

        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
            City / Location
          </label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="e.g. St. Louis MO, Chicago IL"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/40 focus:border-navy"
            disabled={loading}
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading || !niche.trim() || !location.trim()}
            className="w-full sm:w-auto bg-navy hover:bg-navy-light text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Scanning...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                Find Leads
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
