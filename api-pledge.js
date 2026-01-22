// pages/api/pledge.js
// This API route handles pledge submissions

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, phone, message, amount, project } = req.body;

  // Validate required fields
  if (!name || !email || !amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Store pledge in database (add your database logic here)
    // Example: await db.pledges.create({ name, email, phone, message, amount, project })

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
    // See /pages/api/contact.js for email service examples

    console.log('Pledge submission:', { name, email, phone, amount, project });
    console.log('Email to admin:', emailData);
    console.log('Confirmation email:', confirmationEmail);

    return res.status(200).json({ 
      message: 'Pledge submitted successfully',
      // Remove this in production:
      note: 'Email service and database not configured yet - see comments in /pages/api/pledge.js'
    });

  } catch (error) {
    console.error('Error processing pledge:', error);
    return res.status(500).json({ message: 'Failed to process pledge' });
  }
}
