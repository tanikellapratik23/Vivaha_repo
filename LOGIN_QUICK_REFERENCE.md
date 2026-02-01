# Quick Reference - Login Credentials

## 🔐 Admin Account

```
📧 Email:     pratiktanikella@gmail.com  (or: pratiktanikella)
🔑 Password:  DqAmcCB4/
📍 Access:    Full admin dashboard
```

## 👤 Test User Accounts

| Email | Password | Status |
|-------|----------|--------|
| sarah@test.com | TestPassword123! | Onboarded |
| marcus@test.com | TestPassword123! | Onboarded |
| priya@test.com | TestPassword123! | Onboarded |
| emma@test.com | TestPassword123! | Onboarded |
| alex@test.com | TestPassword123! | Onboarded |

---

## 🚀 How to Test

### Test Admin Login:
1. Go to: `http://localhost:5173/login`
2. Enter email: `pratiktanikella@gmail.com`
3. Enter password: `DqAmcCB4/`
4. Click "Login"
5. ✅ Should go directly to dashboard

### Test User Login:
1. Go to: `http://localhost:5173/login`
2. Enter email: `sarah@test.com`
3. Enter password: `TestPassword123!`
4. Click "Login"
5. ✅ Should go to dashboard (already onboarded)

### Test Failed Login:
1. Go to: `http://localhost:5173/login`
2. Enter email: `admin@test.com`
3. Enter password: `WrongPassword`
4. Click "Login"
5. ✅ Should show "Invalid credentials"

---

## 🔄 Login Flow

```
User submits form
        ↓
Backend checks: Admin first?
        ↓
If NOT admin: Search database
        ↓
Credentials match?
        ↓
YES: Generate JWT token + user info
        ↓
Frontend stores token in localStorage
        ↓
Redirect to dashboard or onboarding
```

---

## 🎯 Key Features

✅ Admin access with hardcoded credentials  
✅ Regular users from database (with hashed passwords)  
✅ JWT tokens for all requests  
✅ 30-day token expiration  
✅ Session persistence (token in localStorage)  
✅ Automatic logout on token expiration  
✅ Seamless redirect to dashboard/onboarding  

---

## 💾 Session Storage

```typescript
// After login, automatically stored:
localStorage.setItem('token', 'eyJhbGc...');

// Persists across:
├─ Browser refresh ✅
├─ Tab close/reopen ✅  
└─ Computer restart ✅

// Cleared on:
├─ User logout
├─ Manual localStorage.clear()
└─ 30-day expiration
```

---

## 🛠️ For Developers

**Backend Auth Endpoint:**
```
POST /api/auth/login
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@email.com",
    "isAdmin": false,
    "onboardingCompleted": true
  }
}
```

---

## 📋 All Features

| Feature | Admin | User |
|---------|-------|------|
| Dashboard Access | ✅ | ✅ |
| Add Wedding Details | ✅ | ✅ |
| Manage Guests | ✅ | ✅ |
| Budget Tracking | ✅ | ✅ |
| Vendor Search | ✅ | ✅ |
| Outfit Planner | ✅ | ✅ |
| Story Builder | ✅ | ✅ |
| Bachelor Party | ✅ | ✅ |

---

**Build Status**: ✅ Ready  
**Last Updated**: Feb 1, 2026
