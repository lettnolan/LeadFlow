import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import leadsRouter from '../backend/src/routes/leads.js';
import outreachRouter from '../backend/src/routes/outreach.js';
import billingRouter from '../backend/src/routes/billing.js';
import adminRouter from '../backend/src/routes/admin.js';

const app = express();

app.use(cors({ origin: '*' }));
app.use('/api/billing/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

app.use('/api/leads', leadsRouter);
app.use('/api/outreach', outreachRouter);
app.use('/api/billing', billingRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (_, res) => res.json({ ok: true }));

export default app;
