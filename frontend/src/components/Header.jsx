export default function Header({ user, isPro, searchesUsed, freeLimit, onUpgrade, onSignIn, onSignOut }) {
  const remaining = Math.max(0, freeLimit - searchesUsed);

  return (
    <header className="bg-navy text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center font-bold text-navy text-sm">
            LF
          </div>
          <div>
            <span className="font-bold text-lg leading-none">LeadFlow</span>
            <span className="block text-gold text-xs leading-none mt-0.5">by Gateway Digital Co.</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {!isPro && (
                <div className="hidden sm:flex items-center gap-2">
                  {/* Search usage bar */}
                  <div className="text-xs text-white/70">
                    <span className="text-white font-semibold">{searchesUsed}</span>
                    <span> of {freeLimit} searches used</span>
                  </div>
                  <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${searchesUsed >= freeLimit ? 'bg-red-400' : 'bg-gold'}`}
                      style={{ width: `${Math.min(100, (searchesUsed / freeLimit) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {isPro && (
                <span className="hidden sm:inline-flex items-center gap-1 bg-gold/20 text-gold text-xs font-semibold px-2.5 py-1 rounded-full">
                  ✦ Pro
                </span>
              )}

              {!isPro && (
                <button
                  onClick={onUpgrade}
                  className="bg-gold hover:bg-gold-light text-navy font-semibold text-sm px-3 py-1.5 rounded-lg transition-colors"
                >
                  Upgrade
                </button>
              )}

              <div className="flex items-center gap-2 border-l border-white/20 pl-3">
                <span className="hidden sm:block text-xs text-white/60 truncate max-w-32">{user.email}</span>
                <button
                  onClick={onSignOut}
                  className="text-xs text-white/60 hover:text-white transition-colors"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={onSignIn}
              className="bg-gold hover:bg-gold-light text-navy font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
