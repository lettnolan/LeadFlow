# LeadFlow Setup Guide

## Prerequisites
- Node.js 20+ (install via https://nodejs.org or `brew install node`)
- Google Maps Places API key
- Anthropic API key
- Stripe account

## 1. Install dependencies

```bash
cd ~/Documents/leaderflow/backend && npm install
cd ~/Documents/leaderflow/frontend && npm install
```

## 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
# Then edit backend/.env with your actual keys
```

Required keys:
- `GOOGLE_PLACES_API_KEY` — Enable "Places API" in Google Cloud Console
- `ANTHROPIC_API_KEY` — from console.anthropic.com
- `STRIPE_SECRET_KEY` — from Stripe Dashboard > Developers > API keys
- `STRIPE_PRO_PRICE_ID` — Create a $49/mo product in Stripe, copy the Price ID

## 3. Run locally

Terminal 1 (backend):
```bash
cd ~/Documents/leaderflow/backend && npm run dev
```

Terminal 2 (frontend):
```bash
cd ~/Documents/leaderflow/frontend && npm run dev
```

Open http://localhost:5173

## 4. Deploy to Vercel

```bash
npm install -g vercel
cd ~/Documents/leaderflow
vercel
```

Set all `.env` keys as Vercel environment variables in the dashboard.

## Stripe Webhook (for Pro subscription management)

```bash
stripe listen --forward-to localhost:3001/api/billing/webhook
```

Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.
