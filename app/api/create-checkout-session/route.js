// app/api/create-checkout-session/route.js
// Creates a Stripe Checkout session for donations

import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, name, email, project, message } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Get the origin URL for success/cancel redirects
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Convert amount to pence (Stripe uses smallest currency unit)
    const amountInPence = Math.round(parseFloat(amount) * 100);

    // Create project name for line item
    const projectName = project === 'all' 
      ? 'Donation - All Projects' 
      : `Donation - Project ${project}`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: projectName,
              description: message || 'Thank you for your donation to Mainstream Movement',
            },
            unit_amount: amountInPence,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email || undefined,
      metadata: {
        donor_name: name || 'Anonymous',
        donor_email: email || '',
        project: project || 'all',
        message: message || '',
      },
      success_url: `${origin}/?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?payment=cancelled`,
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
