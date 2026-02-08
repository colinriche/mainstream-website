// app/api/contact/route.js
// This API route handles contact form submissions and saves to Firestore

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return Response.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to Firestore
    const contactData = {
      name,
      email,
      phone: phone || null,
      message,
      timestamp: serverTimestamp(),
      read: false,
    };

    const docRef = await addDoc(collection(db, "contactSubmissions"), contactData);

    // Email sending logic using a service like SendGrid, Resend, or Nodemailer
    // Example with fetch to an email service:
    
    const emailData = {
      to: 'jules@gomainstream.org',
      from: 'noreply@gomainstream.org', // Configure this in your email service
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        ${phone ? `Phone: ${phone}` : ''}
        
        Message:
        ${message}
      `
    };

    // IMPLEMENTATION NOTE:
    // Replace this with your actual email service integration
    // Examples:
    // 
    // For Resend:
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(emailData)
    // });
    //
    // For SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send(emailData);
    //
    // For Nodemailer (SMTP):
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: process.env.SMTP_PORT,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    //   },
    // });
    // await transporter.sendMail(emailData);

    console.log('Contact form submission saved to Firestore:', docRef.id);
    
    return Response.json({ 
      message: 'Message sent successfully',
      id: docRef.id
    });

  } catch (error) {
    console.error('Error saving contact submission:', error);
    return Response.json(
      { message: 'Failed to send message' },
      { status: 500 }
    );
  }
}
