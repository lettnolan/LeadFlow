export default function LandingPage({ onSignIn }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center font-bold text-navy text-sm">LF</div>
            <div>
              <span className="font-bold text-lg leading-none">LeadFlow</span>
              <span className="block text-gold text-xs leading-none mt-0.5">by Gateway Digital Co.</span>
            </div>
          </div>
          <button
            onClick={onSignIn}
            className="bg-gold hover:bg-gold-light text-navy font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-navy text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold/20 text-gold text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            ✦ AI-Powered Lead Generation
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Find Local Businesses That<br className="hidden md:block" /> Need Your Services
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            LeadFlow scans Google Maps, scores each business by web presence, and writes a personalized outreach email — in seconds. Stop guessing, start closing.
          </p>
          <button
            onClick={onSignIn}
            className="bg-gold hover:bg-gold-light text-navy font-bold text-base px-8 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2"
          >
            Start for Free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <p className="text-white/40 text-xs mt-3">2 free searches per month. No credit card required.</p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-navy text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Enter a Niche & City', desc: 'Type something like "auto detailers in St. Louis" and hit search.' },
              { step: '02', title: 'We Score Every Lead', desc: 'LeadFlow checks each business for a website, scores it, and ranks by opportunity.' },
              { step: '03', title: 'Send the Email', desc: 'Click "Generate Outreach Email" and get a personalized cold email written by AI — ready to copy and send.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-gold font-bold text-3xl mb-3">{step}</div>
                <h3 className="font-bold text-navy mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-navy text-center mb-12">Everything You Need to Fill Your Pipeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: '🗺️', title: 'Google Maps Search', desc: 'Pulls real businesses with addresses, phone numbers, and ratings from Google Maps.' },
              { icon: '🌐', title: 'Website Scoring', desc: 'Automatically detects businesses with no website or a weak one — your best opportunities.' },
              { icon: '✉️', title: 'AI Outreach Emails', desc: 'Claude AI writes a personalized cold email for each lead based on their specific situation.' },
              { icon: '🔖', title: 'Save Your Leads', desc: 'Bookmark leads you want to follow up with and access them anytime from your saved tab.' },
              { icon: '📊', title: 'CSV Export', desc: 'Download your leads as a spreadsheet and import them into any CRM.' },
              { icon: '🏆', title: 'Opportunity Scoring', desc: 'Leads ranked High, Medium, or Low so you know exactly where to focus.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 rounded-xl border border-gray-100 hover:border-navy/20 transition-colors">
                <div className="text-2xl shrink-0">{icon}</div>
                <div>
                  <h3 className="font-semibold text-navy mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-navy mb-12">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-left">
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Free</div>
              <div className="text-4xl font-bold text-navy mb-1">$0</div>
              <div className="text-gray-400 text-sm mb-6">forever</div>
              <ul className="space-y-3 text-sm text-gray-600 mb-8">
                {['2 searches per month', 'AI outreach emails', 'Save & export leads'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={onSignIn} className="w-full border-2 border-navy text-navy font-semibold py-2.5 rounded-xl hover:bg-navy hover:text-white transition-colors">
                Get Started Free
              </button>
            </div>

            {/* Pro */}
            <div className="bg-navy rounded-2xl p-8 text-left relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-gold text-navy text-xs font-bold px-2.5 py-1 rounded-full">POPULAR</div>
              <div className="text-sm font-semibold text-gold uppercase tracking-wide mb-2">Pro</div>
              <div className="text-4xl font-bold text-white mb-1">$49</div>
              <div className="text-white/40 text-sm mb-6">per month</div>
              <ul className="space-y-3 text-sm text-white/80 mb-8">
                {['Unlimited searches', 'AI outreach emails', 'Save & export leads', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-gold font-bold">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={onSignIn} className="w-full bg-gold hover:bg-gold-light text-navy font-semibold py-2.5 rounded-xl transition-colors">
                Start Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-navy text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Client?</h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">Join other agencies and freelancers using LeadFlow to build their client pipeline.</p>
        <button
          onClick={onSignIn}
          className="bg-gold hover:bg-gold-light text-navy font-bold px-8 py-3.5 rounded-xl transition-colors"
        >
          Get Started Free
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-navy border-t border-white/10 text-white/40 text-xs text-center py-6 px-6">
        © {new Date().getFullYear()} Gateway Digital Co. · LeadFlow
      </footer>
    </div>
  );
}
