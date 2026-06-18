import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session for subscription
router.post('/create-checkout', async (req, res) => {
  const { planId, planName, price, duration, successUrl, cancelUrl } = req.body;

  if (!planId || !planName || !price || !duration || !successUrl || !cancelUrl) {
    return res.status(400).json({ error: 'Missing required fields: planId, planName, price, duration, successUrl, cancelUrl' });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: planName,
          },
          unit_amount: Math.round(price * 100),
          recurring: {
            interval: duration === 'annual' ? 'year' : 'month',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  res.json({ url: session.url });
});

// Retrieve session details
router.get('/session/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId parameter is required' });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  res.json({
    id: session.id,
    status: session.payment_status,
    amountTotal: session.amount_total,
    customerEmail: session.customer_details?.email,
    subscriptionId: session.subscription,
  });
});

export default router;