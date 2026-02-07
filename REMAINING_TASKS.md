# Vivaha - Remaining Implementation Tasks

## ✅ COMPLETED (Pushed to GitHub)

1. **Admin Account Created** ✅
   - Email: pratiktanikella@gmail.com
   - Password: DqAmcCB4/DqAmcCB4/
   - Role: admin

2. **Admin Dashboard with Statistics** ✅
   - Total users count
   - Completed onboarding count (updates when users finish onboarding)
   - New users in last 30 days
   - Recent users list with onboarding status

3. **Auto-Generate Ceremony Events Based on Religion** ✅
   - Hindu weddings: Mehndi, Sangeet, Haldi, Baraat, etc.
   - Christian weddings: Rehearsal Dinner, Church Ceremony (NO Mehndi)
   - Muslim weddings: Mehndi, Nikah, Walima
   - Interfaith combinations supported

4. **Fixed Logout Flash** ✅
   - Goes straight to landing page without onboarding flash

5. **Password Visibility Toggles** ✅
   - Added to Login, Register, and ResetPassword pages

---

## 🚧 REMAINING TASKS

### 1. Make Share Wedding Information Page Fully Editable

**Location**: `client/src/components/dashboard/SingleSourceOfTruth.tsx`

**What needs to be done**:
- Add edit mode toggle
- Make all fields editable:
  * Couple names (bride & groom names)
  * Wedding date & time
  * Venue address (full address, not just city/state)
  * Dress code
  * Contact information (name, phone, email)
  * Hotel block details (name, address, booking link)
  * Custom sections (user can add more fields)
- Add Save button that:
  * Updates User model in database
  * Updates shared wedding page immediately
  * Shows success notification
- Make sure changes reflect on `/wedding/{token}` page

**Backend changes needed**:
- Add PUT `/api/wedding-page/update` endpoint
- Update User model to include:
  ```typescript
  weddingPageData: {
    coupleName1: string;
    coupleName2: string;
    weddingDate: Date;
    weddingTime: string;
    venueAddress: string;
    venueName: string;
    dressCode: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    hotelBlocks: [{
      hotelName: string;
      address: string;
      bookingLink: string;
      discountCode: string;
    }];
    customFields: [{
      label: string;
      value: string;
    }];
  }
  ```

---

### 2. Fix All Tabs to Save Properly

**Components to fix**:
- `GuestList.tsx` - Ensure guests save to database
- `BudgetTracker.tsx` - Ensure expenses save to database
- `TodoList.tsx` - Ensure todos save to database
- `VendorManagement.tsx` - Ensure vendors save to database
- `CeremonyPlanning.tsx` - Ensure ceremonies save (already partially done)
- `MusicPlanner.tsx` - Ensure playlists save to database
- `SeatingPlanner.tsx` - Ensure seating charts save to database

**What's needed**:
Each component should:
1. Load data from API on mount (not just localStorage)
2. Auto-save to database using debounced API calls
3. Show "Saving..." / "Saved" indicators
4. Handle offline mode gracefully
5. Sync with backend when coming back online

**Backend endpoints needed** (create if missing):
- POST/PUT `/api/guests`
- POST/PUT `/api/budget`
- POST/PUT `/api/todos`
- POST/PUT `/api/vendors`
- POST/PUT `/api/ceremonies`
- POST/PUT `/api/playlists`
- POST/PUT `/api/seating`

---

### 3. Create 3-4 Auto-Generated Posts for VivahaPosts

**Location**: `server/seed-posts.js` (already exists, needs content)

**What to create**:
1. **2 Blog Posts** (educational content):
   - "How to Plan an Interfaith Wedding: A Complete Guide"
   - "10 Budget-Saving Tips for Modern Weddings"

2. **2 Real Wedding Stories** (inspiration):
   - "Sarah & Raj's Hindu-Christian Fusion Wedding in California"
   - "Priya & Mark's Modern Interfaith Celebration in New York"

**Implementation**:
- Each post should have:
  * Title
  * Author: "Vivaha Team"
  * Content (300-500 words)
  * Tags (interfaith, budget, real-wedding, etc.)
  * Featured image URL
  * Created date
- Run seed script to populate database
- Posts should appear in VivahaPosts community feed

---

### 4. Add AI Budget Suggestions Based on Location

**Location**: `client/src/components/dashboard/BudgetTracker.tsx`

**What to add**:
- AI Suggestions panel that shows:
  * Average costs for user's location (city/state)
  * Recommended budget breakdown by category
  * Cost-saving tips specific to their area
- Use location from onboarding data
- Generate suggestions based on:
  * Wedding city/state
  * Guest count
  * Wedding style (formal, casual, etc.)

**Implementation approach**:
1. Create `generateBudgetSuggestions()` function
2. Base calculations on location multipliers:
   ```typescript
   const locationMultipliers = {
     'New York': 1.8,
     'San Francisco': 1.7,
     'Los Angeles': 1.6,
     'Chicago': 1.3,
     'Austin': 1.2,
     'Atlanta': 1.1,
     // etc...
   };
   ```
3. Calculate per-guest costs:
   * Venue: $100-300/guest (location adjusted)
   * Catering: $75-150/guest
   * Photography: $2,000-5,000 (fixed)
   * DJ/Music: $1,000-3,000 (fixed)
   * Flowers: $1,500-4,000 (fixed)
4. Show AI badge and "powered by location data"

---

### 5. Add Vivaha Map Feature to Landing Page

**Location**: Create new component `client/src/components/VivahaMap.tsx`

**What to build**:
- Interactive U.S. map showing interfaith weddings
- Clicking a pin opens a card with:
  * Interfaith pairing (Hindu-Christian, Muslim-Jewish, etc.)
  * Wedding format (dual ceremony, fusion, civil+religious)
  * Location (city/state only - NO names/faces)
  * Format badges ("One-Day Ceremony", "Dry Wedding", etc.)
- Modal opens from Landing page button: "Explore Interfaith Weddings"

**Technical implementation**:
1. Use SVG map or library like `react-simple-maps`
2. Create `mapData.json` with representative examples:
   ```json
   [
     {
       "id": 1,
       "city": "San Francisco",
       "state": "CA",
       "lat": 37.7749,
       "lng": -122.4194,
       "pairing": "Hindu-Christian",
       "format": "Dual Ceremonies",
       "badges": ["Two-Day Event", "Family-Focused", "Fusion Reception"]
     }
   ]
   ```
3. Add 20-30 representative weddings across US regions
4. Style to match Vivaha's pink/purple gradient theme
5. Make keyboard accessible and screen-reader friendly

**Design requirements**:
- Match existing UI (same buttons, cards, colors)
- Smooth animations (pins scale on hover, cards slide in)
- Mobile responsive (pinch to zoom)
- Clean, elegant, respectful (not playful/gimmicky)

---

## 🎯 PRIORITY ORDER

1. **Fix saving functionality** (Task #2) - CRITICAL for data persistence
2. **Editable wedding share page** (Task #1) - Core feature request
3. **Budget AI suggestions** (Task #4) - High value, moderate effort
4. **VivahaPosts content** (Task #3) - Quick win, good for engagement
5. **Vivaha Map** (Task #5) - Nice-to-have, takes most time

---

## 📝 TESTING CHECKLIST

After implementing each feature:
- [ ] Test in Chrome, Safari, Firefox
- [ ] Test on mobile (iOS/Android)
- [ ] Test offline mode (if applicable)
- [ ] Verify data saves to database
- [ ] Check for TypeScript errors (`npm run build`)
- [ ] Test with admin account
- [ ] Test with regular user account
- [ ] Push to GitHub
- [ ] Verify deployment on GitHub Pages

---

## 🚀 DEPLOYMENT NOTES

- Admin login: https://vivahaplan.com/login
  * Email: pratiktanikella@gmail.com
  * Password: DqAmcCB4/DqAmcCB4/

- GitHub repo: https://github.com/tanikellapratik23/Vivaha_repo
- Live site: https://vivahaplan.com

- Remember to:
  * Run `npm run build` before pushing
  * Check GitHub Actions for build errors
  * Test on production after deploy
