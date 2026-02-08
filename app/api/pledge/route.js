// app/api/pledge/route.js
// This API route handles pledge submissions and saves to Firestore

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, amount, project } = body;

    // Validate required fields
    if (!name || !email || !amount) {
      return Response.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to Firestore
    const pledgeData = {
      name,
      email,
      phone: phone || null,
      message: message || null,
      amount,
      project: project || 'all',
      timestamp: serverTimestamp(),
      read: false,
    };

    const docRef = await addDoc(collection(db, "pledgeSubmissions"), pledgeData);

    // Send confirmation email to jules@gomainstream.org
    const emailData = {
      to: 'jules@gomainstream.org',
      from: 'noreply@gomainstream.org',
      subject: `New Pledge Submission - £${amount}`,
      html: `
        <h2>New Pledge Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Amount:</strong> £${amount}</p>
        <p><strong>Project:</strong> ${project === 'all' ? 'All Projects' : `Project #${project}`}</p>
        ${message ? `<p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>` : ''}
      `,
      text: `
        New Pledge Submission
        
        Name: ${name}
        Email: ${email}
        ${phone ? `Phone: ${phone}` : ''}
        Amount: £${amount}
        Project: ${project === 'all' ? 'All Projects' : `Project #${project}`}
        ${message ? `\nMessage:\n${message}` : ''}
      `
    };

    // Send confirmation email to pledger
    const confirmationEmail = {
      to: email,
      from: 'jules@gomainstream.org',
      subject: 'Thank you for your pledge - Mainstream Movement',
      html: `
        <h2>Thank You for Your Pledge!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for pledging £${amount} to support ${project === 'all' ? 'all our projects' : 'our project'}.</p>
        <p>We will keep you updated on our progress and reach out when we achieve the milestones you're supporting.</p>
        <p>Best regards,<br>The Mainstream Movement Team</p>
      `,
      text: `
        Thank You for Your Pledge!
        
        Dear ${name},
        
        Thank you for pledging £${amount} to support ${project === 'all' ? 'all our projects' : 'our project'}.
        
        We will keep you updated on our progress and reach out when we achieve the milestones you're supporting.
        
        Best regards,
        The Mainstream Movement Team
      `
    };

    // IMPLEMENTATION NOTE:
    // Replace with your actual email service and database integration
    // See /app/api/contact/route.js for email service examples

    console.log('Pledge submission saved to Firestore:', docRef.id);
    console.log('Email to admin:', emailData);
    console.log('Confirmation email:', confirmationEmail);

    return Response.json({ 
      message: 'Pledge submitted successfully',
      id: docRef.id
    });

  } catch (error) {
    console.error('Error processing pledge:', error);
    return Response.json(
      { message: 'Failed to process pledge' },
      { status: 500 }
    );
  }
}
