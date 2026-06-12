import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import leadsRouter from './routes/leads.js';
import outreachRouter from './routes/outreach.js';
import billingRouter from './routes/billing.js';
import adminRouter from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));

// Stripe webhook must receive raw body — mount before express.json()
app.use('/api/billing/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

app.use('/api/leads', leadsRouter);
app.use('/api/outreach', outreachRouter);
app.use('/api/billing', billingRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`LeadFlow API running on :${PORT}`));
