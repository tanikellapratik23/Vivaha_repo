const fs = require('fs');
const path = require('path');

/**
 * Email Templates Sender for Vivaha
 * 
 * Usage:
 * npm install resend nodemailer
 * 
 * Then uncomment the email service you want to use below
 */

// ========================
// Option 1: Using Resend
// ========================
// Recommended for production - most reliable for transactional emails

async function sendWithResend() {
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  // Load template
  const templatePath = path.join(__dirname, 'welcome-setup.html');
  const htmlContent = fs.readFileSync(templatePath, 'utf8');

  const response = await resend.emails.send({
    from: 'Vivaha <onboarding@vivaha.co>',
    to: 'pratiktanikella@gmail.com',
    subject: 'Welcome to Vivaha - Start Planning Your Wedding',
    html: htmlContent.replace(/{{first_name}}/g, 'Pratik')
      .replace(/{{dashboard_url}}/g, 'https://app.vivaha.co')
      .replace(/{{current_year}}/g, new Date().getFullYear())
  });

  console.log('Email sent via Resend:', response);
}

// ========================
// Option 2: Using SendGrid
// ========================
// Popular alternative - good for bulk and transactional

async function sendWithSendGrid() {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const templatePath = path.join(__dirname, 'welcome-setup.html');
  const htmlContent = fs.readFileSync(templatePath, 'utf8');

  const msg = {
    to: 'pratiktanikella@gmail.com',
    from: 'onboarding@vivaha.co',
    subject: 'Welcome to Vivaha - Start Planning Your Wedding',
    html: htmlContent.replace(/{{first_name}}/g, 'Pratik')
      .replace(/{{dashboard_url}}/g, 'https://app.vivaha.co')
      .replace(/{{current_year}}/g, new Date().getFullYear())
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent via SendGrid');
  } catch (error) {
    console.error('SendGrid error:', error);
  }
}

// ========================
// Option 3: Using Gmail/Nodemailer
// ========================
// For testing - requires Gmail app password

async function sendWithGmail() {
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  const templatePath = path.join(__dirname, 'welcome-setup.html');
  const htmlContent = fs.readFileSync(templatePath, 'utf8');

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: 'pratiktanikella@gmail.com',
    subject: 'Welcome to Vivaha - Start Planning Your Wedding',
    html: htmlContent.replace(/{{first_name}}/g, 'Pratik')
      .replace(/{{dashboard_url}}/g, 'https://app.vivaha.co')
      .replace(/{{current_year}}/g, new Date().getFullYear())
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent via Gmail');
  } catch (error) {
    console.error('Gmail error:', error);
  }
}

// ========================
// Usage
// ========================

// Choose one:
// await sendWithResend();
// await sendWithSendGrid();
// await sendWithGmail();

console.log('Email templates compiled and ready to send!');
console.log('');
console.log('HTML templates location:');
fs.readdirSync(__dirname)
  .filter(f => f.endsWith('.html'))
  .forEach(f => console.log(`  - ${f}`));

console.log('');
console.log('To send emails:');
console.log('1. Choose an email service provider (Resend, SendGrid, or Gmail)');
console.log('2. Set environment variables with API keys');
console.log('3. Uncomment the corresponding function and run this script');
console.log('');
console.log('Recommended for production: Resend (fastest setup, best reliability)');
