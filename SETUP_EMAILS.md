# 📧 Setting Up Emails for Vivaha

Your forgot password and welcome emails are now ready to go! Just need to add your Resend API key.

## Quick Setup (2 minutes)

### 1. Get Your Free Resend API Key

```bash
# Open this in your browser:
https://resend.com/signup
```

1. Sign up (free tier is plenty!)
2. Verify your email
3. Go to **API Keys** → **Create API Key**
4. Copy the key (starts with `re_`)

### 2. Add Key to Your Server

Open `server/.env` and replace the placeholder:

```env
RESEND_API_KEY=re_your_actual_key_here
```

### 3. Test It!

```bash
cd server
node test-email.js your-email@example.com
```

You should get a test email in seconds! 🎉

## What Works Now

✅ **Welcome Emails** - Automatically sent when users register  
✅ **Password Reset Emails** - Sent from the "Forgot Password" flow  
✅ **Beautiful Design** - Pink/orange gradient, responsive HTML  
✅ **Vivaha Branding** - Professional templates with your logo

## Testing the Forgot Password Flow

1. Start the server: `cd server && npm run dev`
2. Go to login page
3. Click "Forgot password?"
4. Enter an email address that exists in your database
5. Check that email's inbox!

## Troubleshooting

**"Email not sent" warning in console?**
- Make sure RESEND_API_KEY is in `server/.env`
- Restart the server after adding the key
- Run the test script to verify: `node server/test-email.js`

**No email received?**
- Check spam folder
- Verify the email exists in your database
- Check server console logs for errors

**Need help?**
- [Resend Docs](https://resend.com/docs)
- [Resend Status](https://resend.com/status)

---

That's it! Your emails are ready to send. 💌
