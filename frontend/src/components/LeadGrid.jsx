import LeadCard from './LeadCard.jsx';

export default function LeadGrid({ leads }) {
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

  return (
    <div className="mt-6">
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <span className="font-semibold text-navy">{leads.length} leads found</span>
        {high.length > 0 && <ScoreBadge score="high" count={high.length} />}
        {medium.length > 0 && <ScoreBadge score="medium" count={medium.length} />}
        {low.length > 0 && <ScoreBadge score="low" count={low.length} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads.map(lead => (
          <LeadCard key={lead.id} lead={lead} />
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
