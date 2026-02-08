// lib/stripe.js
// Stripe initialization for server-side operations

import Stripe from 'stripe';

// Initialize Stripe with secret key from environment variables
// Note: STRIPE_SECRET_KEY should be set in .env.local or Vercel environment variables
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});
