import LeadCard from './LeadCard.jsx';

export default function LeadGrid({ leads, savedLeadIds, onToggleSave }) {
  if (leads.length === 0) {
    return (
      <div className="mt-10 text-center text-gray-500">
        <p className="text-lg font-medium">No leads found</p>
        <p className="text-sm mt-1">Try a different niche or location.</p>
      </div>
    );
  }

  const high = leads.filter(l => l.opportunityScore === 'high');
  const medium = leads.filter(l => l.opportunityScore === 'medium');
  const low = leads.filter(l => l.opportunityScore === 'low');

  function downloadCSV() {
    const headers = ['Name', 'Address', 'Phone', 'Website', 'Website Status', 'Opportunity', 'Rating', 'Reviews'];
    const rows = leads.map(l => [
      l.name,
      l.address,
      l.phone || '',
      l.website || '',
      l.websiteStatus,
      l.opportunityScore,
      l.rating || '',
      l.reviewCount || 0,
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leadflow-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
          <span className="font-semibold text-navy">{leads.length} leads found</span>
          {high.length > 0 && <ScoreBadge score="high" count={high.length} />}
          {medium.length > 0 && <ScoreBadge score="medium" count={medium.length} />}
          {low.length > 0 && <ScoreBadge score="low" count={low.length} />}
        </div>

        <button
          onClick={downloadCSV}
          className="flex items-center gap-1.5 bg-white border border-gray-300 hover:border-navy text-navy font-semibold text-xs px-3 py-2 rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads.map(lead => (
          <LeadCard
            key={lead.id}
            lead={lead}
            saved={savedLeadIds?.has(lead.id)}
            onToggleSave={onToggleSave}
          />
        ))}
      </div>
    </div>
  );
}

function ScoreBadge({ score, count }) {
  const styles = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[score]}`}>
      {count} {score} opportunity
    </span>
  );
}
