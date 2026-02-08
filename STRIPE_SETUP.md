# Stripe Integration Setup Guide

This guide will help you complete the Stripe payment integration for the Mainstream Movement website.

## Environment Variables

Make sure you have the following environment variables set in your `.env.local` file (for local development) and in Vercel (for production):

### Required Variables

```env
# Stripe Secret Key (server-side)
STRIPE_SECRET_KEY=sk_test_...  # Use sk_live_... for production

# Stripe Publishable Key (optional - only needed if using Stripe Elements)
# For Stripe Checkout (redirect-based), this is not required
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Use pk_live_... for production

# Optional: Webhook Secret (for payment confirmations)
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: Site URL (for redirects)
NEXT_PUBLIC_SITE_URL=https://gomainstream.org
```

**Important Notes:**
- `STRIPE_SECRET_KEY` is used server-side only (in API routes)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is optional - only needed if you plan to use Stripe Elements (we're using Checkout, so it's not required)
- Use test keys (`sk_test_` and `pk_test_`) during development
- Switch to live keys (`sk_live_` and `pk_live_`) only when ready for production
- If you named your publishable key `STRIPE_PUBLISHABLE_KEY`, you can rename it to `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` or leave it as-is (it won't be used with Checkout)

## Getting Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
3. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
4. Add them to your environment variables

## Setting Up Webhooks (Optional but Recommended)

Webhooks allow you to receive real-time notifications about payment events.

### 1. Create a Webhook Endpoint

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter your endpoint URL:
   - **Development**: `https://your-ngrok-url.ngrok.io/api/webhook`
   - **Production**: `https://gomainstream.org/api/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

### 2. Testing Webhooks Locally

For local development, use a tool like [ngrok](https://ngrok.com/) to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Start your Next.js dev server
npm run dev

# In another terminal, expose port 3000
ngrok http 3000

# Use the ngrok URL in your Stripe webhook endpoint
```

## How It Works

### Payment Flow

1. **User fills out donation form** → Clicks "Proceed to Payment"
2. **API creates checkout session** → `/api/create-checkout-session`
3. **User redirected to Stripe Checkout** → Secure payment page
4. **User completes payment** → Stripe processes payment
5. **User redirected back** → `/?payment=success`
6. **Webhook receives event** → `/api/webhook` saves payment to Firestore

### API Endpoints

#### `POST /api/create-checkout-session`
Creates a Stripe Checkout session and returns the checkout URL.

**Request Body:**
```json
{
  "amount": 50.00,
  "name": "John Doe",
  "email": "john@example.com",
  "project": "all",
  "message": "Thank you for your work!"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

#### `POST /api/webhook`
Handles Stripe webhook events (payment confirmations).

**Note:** This endpoint requires the `STRIPE_WEBHOOK_SECRET` to be set.

## Testing

### Test Mode

1. Use test API keys (`sk_test_` and `pk_test_`)
2. Use Stripe test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - Use any future expiry date and any 3-digit CVC
3. Test the full flow:
   - Submit donation form
   - Complete payment with test card
   - Verify redirect to success page
   - Check Firestore for payment record (if webhook is set up)

### Production

1. Switch to live API keys (`sk_live_` and `pk_live_`)
2. Update webhook endpoint to production URL
3. Test with a small real payment first
4. Monitor Stripe Dashboard for transactions

## Firestore Collections

The integration saves payments to Firestore in the `donations` collection with the following structure:

```javascript
{
  sessionId: "cs_test_...",
  amount: 50.00,
  currency: "gbp",
  customerEmail: "john@example.com",
  customerName: "John Doe",
  project: "all",
  message: "Thank you for your work!",
  paymentStatus: "paid",
  timestamp: Timestamp
}
```

## Troubleshooting

### "Invalid API Key"
- Check that `STRIPE_SECRET_KEY` is set correctly
- Ensure you're using the right key type (test vs live)
- Restart your dev server after adding environment variables

### "Checkout session creation failed"
- Verify the amount is valid (greater than 0)
- Check that all required fields are provided
- Review server logs for detailed error messages

### "Webhook signature verification failed"
- Ensure `STRIPE_WEBHOOK_SECRET` is set correctly
- Verify the webhook endpoint URL matches in Stripe Dashboard
- Check that you're using the correct signing secret for your endpoint

### Payment succeeds but not saved to Firestore
- Verify webhook is configured correctly
- Check Firestore security rules allow writes
- Review server logs for webhook errors

## Security Best Practices

1. **Never expose secret keys** - Only use `NEXT_PUBLIC_` prefix for publishable keys
2. **Use environment variables** - Never hardcode API keys
3. **Verify webhook signatures** - Always validate webhook requests
4. **Use HTTPS** - Required for Stripe Checkout and webhooks
5. **Monitor your account** - Regularly check Stripe Dashboard for suspicious activity

## Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)

For integration issues:
- Check server logs
- Review Firestore security rules
- Verify environment variables are set correctly
