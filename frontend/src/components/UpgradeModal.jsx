export default function UpgradeModal({ onClose, userEmail }) {
  async function handleUpgrade() {
    const res = await fetch('/api/billing/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail || '' }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ×
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/20 mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          <h2 className="text-2xl font-bold text-navy mb-2">Upgrade to Pro</h2>
          <p className="text-gray-500 text-sm">
            You've used all 2 free searches this month. Go Pro for unlimited leads.
          </p>
        </div>

        <div className="bg-navy/5 rounded-xl p-5 mb-6">
          <div className="flex items-end gap-1 mb-4">
            <span className="text-3xl font-bold text-navy">$49</span>
            <span className="text-gray-500 text-sm mb-1">/month</span>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            {[
              'Unlimited searches per month',
              'AI-generated outreach emails',
              'Export leads to CSV',
              'Priority support',
            ].map(f => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-gold font-bold">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleUpgrade}
          className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-3 rounded-xl transition-colors text-base"
        >
          Upgrade Now — $49/mo
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          Cancel anytime. Billed monthly via Stripe.
        </p>
      </div>
    </div>
  );
}
