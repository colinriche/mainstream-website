// pages/api/contact.js
// This API route handles contact form submissions and sends emails

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
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

    console.log('Contact form submission:', emailData);
    
    // For now, return success (replace with actual email sending logic)
    return res.status(200).json({ 
      message: 'Message sent successfully',
      // Remove this in production:
      note: 'Email service not configured yet - see comments in /pages/api/contact.js'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send message' });
  }
}
