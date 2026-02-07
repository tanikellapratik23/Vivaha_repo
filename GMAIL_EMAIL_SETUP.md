# Gmail Email Setup (FREE & UNLIMITED)

## Why Gmail?
- ✅ **Completely FREE**
- ✅ **Unlimited emails** for personal use
- ✅ **No credit card required**
- ✅ **More reliable** than free tier APIs

## Setup Steps (5 minutes)

### 1. Enable 2-Step Verification
1. Go to https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow the setup wizard to enable it

### 2. Create App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select app: "Mail"
3. Select device: "Other" → enter "Vivaha"
4. Click "Generate"
5. **Copy the 16-character password** (you'll only see it once!)

### 3. Update .env File
Open `server/.env` and add:

```bash
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

**Example:**
```bash
GMAIL_USER=pratiktanikella@gmail.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

### 4. Restart Server
```bash
npm run dev
```

### 5. Test It!
1. Go to `/forgot-password`
2. Enter your email
3. Check your inbox!

---

## How It Works

The system now uses **Gmail as primary** (free & unlimited) and falls back to Resend if Gmail isn't configured.

**Priority:**
1. Gmail (if `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set) ✅
2. Resend (if Gmail not configured)
3. No email (logs warning)

---

## Troubleshooting

**"Invalid credentials" error?**
- Make sure 2-Step Verification is enabled
- Use App Password, NOT your regular Gmail password
- Remove spaces from the app password

**Not receiving emails?**
- Check spam folder
- Verify email address is correct
- Check server logs for errors

**Still not working?**
- Make sure server restarted after .env changes
- Check `.env` file has correct format (no quotes needed)
- Verify 2-Step Verification is ON

---

## Benefits vs Resend

| Feature | Gmail | Resend Free |
|---------|-------|-------------|
| Monthly Emails | Unlimited | 3,000 |
| Daily Limit | No limit | 100 |
| Cost | FREE | FREE |
| Setup Time | 5 min | 2 min |
| Reliability | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**Winner: Gmail** 🏆
