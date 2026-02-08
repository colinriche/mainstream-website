// app/api/webhook/route.js
// Stripe webhook handler for payment events
// This handles payment confirmations and updates your database

import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Get the webhook secret from environment variables
// Set this in Vercel: STRIPE_WEBHOOK_SECRET
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Determine if this is a recurring donation
      const isRecurring = session.metadata?.is_recurring === 'true';
      const billingFrequency = session.metadata?.billing_frequency || 'one-time';
      
      // Save successful payment to Firestore
      try {
        const paymentData = {
          sessionId: session.id,
          amount: session.amount_total / 100, // Convert from pence to pounds
          currency: session.currency,
          customerEmail: session.customer_email || session.customer_details?.email,
          customerName: session.metadata?.donor_name || 'Anonymous',
          project: session.metadata?.project || 'all',
          message: session.metadata?.message || '',
          paymentStatus: session.payment_status,
          isRecurring: isRecurring,
          billingFrequency: billingFrequency,
          subscriptionId: session.subscription || null,
          timestamp: serverTimestamp(),
        };

        await addDoc(collection(db, 'donations'), paymentData);
        console.log(`${isRecurring ? 'Recurring donation' : 'One-time donation'} saved to Firestore:`, session.id);
      } catch (firestoreError) {
        console.error('Error saving payment to Firestore:', firestoreError);
        // Don't fail the webhook if Firestore save fails
      }
    }

    // Handle subscription payment events (for recurring donations)
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;
      
      // Get subscription details
      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const customer = await stripe.customers.retrieve(subscription.customer);
        
        // Save recurring payment to Firestore
        const paymentData = {
          subscriptionId: subscriptionId,
          invoiceId: invoice.id,
          amount: invoice.amount_paid / 100, // Convert from pence to pounds
          currency: invoice.currency,
          customerEmail: typeof customer === 'object' && customer.email ? customer.email : null,
          customerName: subscription.metadata?.donor_name || 'Anonymous',
          project: subscription.metadata?.project || 'all',
          message: subscription.metadata?.message || '',
          paymentStatus: 'paid',
          isRecurring: true,
          billingFrequency: subscription.items.data[0]?.price?.recurring?.interval === 'year' ? 'yearly' : 'monthly',
          timestamp: serverTimestamp(),
        };

        await addDoc(collection(db, 'donations'), paymentData);
        console.log('Recurring payment saved to Firestore:', invoice.id);
      } catch (error) {
        console.error('Error processing subscription payment:', error);
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
