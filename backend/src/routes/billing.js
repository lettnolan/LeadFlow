import { Router } from 'express';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post('/create-checkout', async (req, res) => {
  const { email } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}?upgrade=success`,
      cancel_url: `${process.env.FRONTEND_URL}?upgrade=cancelled`,
      // Store email in metadata so we can look up the user in the webhook
      metadata: { email },
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send('Webhook signature invalid');
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const email = session.customer_email || session.metadata?.email;
        if (email) await setUserPlan(email, 'pro');
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.paused': {
        // Subscription cancelled or payment failed — downgrade to free
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer);
        if (customer.email) await setUserPlan(customer.email, 'free');
        break;
      }

      case 'invoice.payment_failed': {
        // Optionally handle payment failures (e.g. send warning email)
        console.warn('Payment failed for customer:', event.data.object.customer_email);
        break;
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }

  res.json({ received: true });
});

async function setUserPlan(email, plan) {
  // Look up user by email in auth.users via admin API
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) throw error;

  const user = data.users.find(u => u.email === email);
  if (!user) {
    console.warn(`Webhook: no user found for email ${email}`);
    return;
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ plan })
    .eq('id', user.id);

  if (updateError) throw updateError;
  console.log(`Set ${email} to plan: ${plan}`);
}

export default router;
