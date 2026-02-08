# Data Persistence Fix - Testing Guide

## Summary of Changes

This fix ensures that all user data (guests, budget, todos, settings) persists consistently across login/logout cycles.

### Server Changes
1. **New `/api/user/sync` endpoint** - Fetches all user data from database in one call
2. **Updated server routes** - All routes now properly validate and save user data with `userId`

### Client Changes
1. **New `dataSync.ts` utility** - Provides `syncUserData()` function to sync all data on page load
2. **Dashboard component** - Now calls sync on load and before page unload
3. **GuestList, BudgetTracker, TodoList** - Improved fetch functions with better error handling and fallbacks
4. **Improved data persistence** - All components now update localStorage with server data on successful fetch

### How It Works

```
User Login
    ↓
Dashboard Loads → Calls syncUserData()
    ↓
syncUserData() calls `/api/user/sync`
    ↓
Server returns all user data (guests, budget, todos, onboarding)
    ↓
Client updates localStorage with all data
    ↓
Individual components fetch from localStorage
    ↓
User modifies data → Saved to server (auto-save or manual save)
    ↓
On logout → Data cleared from localStorage
    ↓
On login → Cycle repeats, pulling fresh data from server
```

## Testing Checklist

### Test 1: New User Data Persists After Logout/Login
1. Log in to account
2. Add a guest (name, email, RSVP status)
3. Add a budget category (name, amount)
4. Add a todo item
5. Update onboarding settings (preferred color theme)
6. **Log out**
7. **Log back in** ← Data should all be present
8. Verify:
   - ✅ Guest list has the new guest
   - ✅ Budget shows the new category
   - ✅ Todo list has the item
   - ✅ Settings show the selected color theme

### Test 2: Modified Data Persists
1. Log in with existing data
2. Modify existing guest RSVP status
3. Change budget category amount
4. Mark todo as completed
5. **Close browser tab/refresh page**
6. Verify all changes are still there

### Test 3: Multiple Accounts Have Separate Data
1. Create Account A, add guest "Alice"
2. Log out
3. Create Account B, add guest "Bob"
4. Log out
5. Log in to Account A → Should see only "Alice"
6. Log out
7. Log in to Account B → Should see only "Bob"

### Test 4: Offline Mode Works
1. Enable offline mode in settings
2. Add guest while offline
3. Refresh page
4. Guest should still be there (from localStorage)
5. Go online, click "Save All Changes"
6. Guest should now be in database
7. Log out and log back in
8. Guest should still be there (from database)

### Test 5: Auto-Save Works
1. Enable auto-save toggle
2. Make changes to data
3. Wait 2 seconds
4. Check browser console for "✅ Synced" message
5. Close browser
6. Reopen and log in
7. Changes should persist

### Test 6: Large Data Sets
1. Import guest list with 500+ guests
2. Add 20 budget categories
3. Add 50 todos
4. Wait for sync
5. Check browser console for timing
6. Verify all data loads correctly

## Console Messages to Look For

### On Page Load
```
🔄 Starting user data sync...
✅ Synced guests: 10
✅ Synced budget: 5
✅ Synced todos: 15
✅ All user data synced successfully
```

### When Fetching Data
```
✅ Fetched 10 guests from server
✅ Fetched 5 budget categories from server
✅ Fetched 15 todos from server
```

### When Saving Data
```
✅ Guest added and saved to server
✅ Budget saved to server
✅ Todo updated on server
```

### Offline Mode
```
📴 Offline mode - loading guests from cache
💾 Guest saved locally
📦 Using cached guests
```

## What Each Component Does

### Dashboard.tsx
- Calls `syncUserData()` on mount
- Sets up page unload handler to preserve cache

### GuestList.tsx
- Fetches guests on load with proper error handling
- Updates guests in real-time
- Saves new guests immediately to server if online
- Falls back to localStorage if server unavailable

### BudgetTracker.tsx
- Fetches budget categories on load
- Auto-saves changes with 2-second debounce
- Updates localStorage with server data

### TodoList.tsx
- Fetches todos on load
- Updates localStorage with server data
- Saves changes immediately

### Settings.tsx
- Loads onboarding data from API
- Falls back to localStorage if needed
- Saves all settings to both server and localStorage

## Troubleshooting

### Data Not Persisting?
1. Check browser console for errors
2. Verify user is logged in (token exists)
3. Check Network tab in DevTools for API calls
4. Verify MongoDB connection is working
5. Check that userId is being passed correctly

### Data Lost After Login?
1. Check that `/api/user/sync` is returning data
2. Verify user document in database has correct data
3. Check localStorage is being updated after fetch
4. Clear browser cache and try again

### Slow Load Times?
1. Check if sync is taking too long (should be < 5 seconds)
2. Consider pagination for large guest lists
3. Monitor database query performance

## Database Verification

Check that user data is being saved correctly:

```bash
# Connect to MongoDB
db.users.findOne({ email: "test@example.com" })

# Should see:
{
  _id: ObjectId(...),
  email: "test@example.com",
  name: "Test User",
  onboardingData: { ... },
  createdAt: Date,
  ...
}

# Check guests collection
db.guests.find({ userId: ObjectId(...) })

# Should return all guests for this user

# Check budget collection
db.budgetcategories.find({ userId: ObjectId(...) })

# Should return all budget categories for this user
```

## Performance Targets
- Sync on load: < 5 seconds
- Individual API calls: < 2 seconds
- Auto-save debounce: 2 seconds
- Page unload: instant (non-blocking)
