const WEAK_SIGNALS = [
  /wix\.com/i,
  /weebly\.com/i,
  /squarespace\.com/i,
  /godaddy\.com/i,
  /yolasite\.com/i,
  /site123\.me/i,
  /mystrikingly\.com/i,
  /jimdo\.com/i,
];

export async function checkWebsite(url) {
  if (!url) return { status: 'none', score: 'high' };

  const isBuilderPlatform = WEAK_SIGNALS.some(rx => rx.test(url));
  if (isBuilderPlatform) return { status: 'weak', score: 'medium' };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 LeadFlow-Checker/1.0' },
    });
    clearTimeout(timeout);

    const html = await res.text();
    const weakScore = scoreWebsite(html, url);
    return { status: weakScore >= 3 ? 'weak' : 'decent', score: weakScore >= 3 ? 'medium' : 'low' };
  } catch {
    // Unreachable / timeout counts as potential opportunity
    return { status: 'unreachable', score: 'medium' };
  }
}

function scoreWebsite(html, url) {
  let score = 0;
  if (html.length < 3000) score += 2;
  if (!/<meta[^>]+description/i.test(html)) score += 1;
  if (!/<h1/i.test(html)) score += 1;
  if (!/viewport/i.test(html)) score += 1; // not mobile-friendly
  if (WEAK_SIGNALS.some(rx => rx.test(html))) score += 2;
  return score;
}
