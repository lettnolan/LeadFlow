import { useState } from 'react';

const SCORE_CONFIG = {
  high: {
    label: 'High Opportunity',
    badge: 'bg-red-100 text-red-700 border-red-200',
    border: 'border-red-300',
    dot: 'bg-red-500',
  },
  medium: {
    label: 'Medium Opportunity',
    badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    border: 'border-yellow-300',
    dot: 'bg-yellow-500',
  },
  low: {
    label: 'Low Opportunity',
    badge: 'bg-green-100 text-green-700 border-green-200',
    border: 'border-gray-200',
    dot: 'bg-green-500',
  },
};

const STATUS_LABEL = {
  none: 'No Website',
  weak: 'Weak Website',
  unreachable: 'Site Unreachable',
  decent: 'Decent Website',
};

export default function LeadCard({ lead, saved, onToggleSave }) {
  const [outreach, setOutreach] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const config = SCORE_CONFIG[lead.opportunityScore] || SCORE_CONFIG.low;

  async function generateOutreach() {
    setGenerating(true);
    setOutreach('');

    const res = await fetch('/api/outreach/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business: lead }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const payload = line.slice(6);
          if (payload === '[DONE]') { setGenerating(false); return; }
          try {
            const { text } = JSON.parse(payload);
            setOutreach(prev => prev + text);
          } catch {}
        }
      }
    }
    setGenerating(false);
  }

  async function copyOutreach() {
    await navigator.clipboard.writeText(outreach);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`bg-white rounded-xl border ${config.border} shadow-sm hover:shadow-md transition-shadow flex flex-col`}>
      {/* Header */}
      <div className="p-4 pb-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-start gap-1">
            <h3 className="font-semibold text-navy text-sm leading-tight line-clamp-2">{lead.name}</h3>
            {onToggleSave && (
              <button
                onClick={() => onToggleSave(lead)}
                className="shrink-0 mt-0.5 text-gray-300 hover:text-gold transition-colors"
                title={saved ? 'Unsave lead' : 'Save lead'}
              >
                <svg className={`w-4 h-4 ${saved ? 'fill-gold text-gold' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            )}
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${config.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </span>
        </div>

        <p className="text-xs text-gray-500 line-clamp-1">{lead.address}</p>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 space-y-2">
        {lead.phone && (
          <Row icon="📞" text={lead.phone} />
        )}

        <Row
          icon="🌐"
          text={STATUS_LABEL[lead.websiteStatus] || lead.websiteStatus}
          className={lead.websiteStatus === 'none' ? 'text-red-600 font-medium' : 'text-gray-600'}
        />

        {lead.website && (
          <a
            href={lead.website}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-blue-600 hover:underline truncate"
          >
            {lead.website}
          </a>
        )}

        {lead.rating && (
          <Row icon="⭐" text={`${lead.rating} (${lead.reviewCount} reviews)`} />
        )}
      </div>

      {/* Outreach section */}
      <div className="p-4 pt-0">
        {outreach ? (
          <div className="mt-2">
            <textarea
              readOnly
              value={outreach}
              rows={6}
              className="w-full text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none"
            />
            <button
              onClick={copyOutreach}
              className="mt-2 w-full bg-gold hover:bg-gold-dark text-navy font-semibold text-xs py-2 rounded-lg transition-colors"
            >
              {copied ? '✓ Copied!' : 'Copy Outreach Message'}
            </button>
          </div>
        ) : (
          <button
            onClick={generateOutreach}
            disabled={generating}
            className="w-full bg-navy hover:bg-navy-light text-white font-semibold text-xs py-2.5 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Writing message...
              </>
            ) : (
              '✉ Generate Outreach Email'
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function Row({ icon, text, className = 'text-gray-600' }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span>{icon}</span>
      <span className={className}>{text}</span>
    </div>
  );
}
