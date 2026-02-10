# Quick Start: Testing Registry Manager & AI Assistant

## Prerequisites
- Node.js and npm installed
- MongoDB running
- GROQ_API_KEY set in `.env.local`
- Vivaha server and client running

## Starting the Application

### Terminal 1: Start Backend
```bash
cd /Users/pratiktanikella/Vivaha_repo/server
npm install  # if needed
npm start
# Server runs on http://localhost:3000
```

### Terminal 2: Start Frontend  
```bash
cd /Users/pratiktanikella/Vivaha_repo/client
npm install  # if needed
npm run dev
# Client runs on http://localhost:5173
```

---

## Testing Registry Manager 🎁

### Step 1: Login
1. Go to http://localhost:5173
2. Login with test account or register new account
3. Complete onboarding (if first time)

### Step 2: Navigate to Registries
1. In dashboard sidebar, click **"Registries"** (🎁 icon)
2. You should see empty state with "+ Add Registry" button

### Step 3: Add First Registry
1. Click **"+ Add Registry"** button
2. Fill in the form:
   - **Name:** My Zola Registry
   - **Type:** Zola
   - **URL:** https://www.zola.com/wedding-registry-example
   - **Notes:** (optional)
3. Click **"Add Registry"**
4. Registry appears in grid below

### Step 4: Test Operations
- **Add more registries:** Try Amazon, Target, Bed Bath & Beyond
- **Edit registry:** Click edit icon on any registry card
- **Delete registry:** Click trash icon to remove
- **Refresh page:** Verify data persists (saved to backend)

### Expected UI
```
Registries Page
├── Header: "Wedding Registries"
├── Subtitle: "Manage your gift registries from all platforms"
├── Stats: "Total Registries: X"
├── + Add Registry Button
└── Registry Cards Grid
    ├── Card 1: Registry name, type, URL
    ├── Card 2: ...
    └── ...
```

---

## Testing AI Assistant 🤖

### Step 1: Spot Floating Widget
1. Look at **bottom-right corner** of any page
2. You should see a **purple floating button with sparkle icon** ✨
3. Hover over button to see tooltip: "Ask AI anything"

### Step 2: Open Chat
1. Click the **floating button**
2. Chat widget opens (width: 384px, height: ~400px)
3. You see:
   - Header: "Vivaha AI" with "Wedding expert" subtitle
   - Message area (empty initially)
   - Quick prompts grid
   - Input field at bottom

### Step 3: Test Quick Prompts
1. Click any quick prompt:
   - 💰 "Budget tips"
   - 👥 "Guest list advice"
   - 🎂 "Vendor questions"
   - 📅 "Timeline guidance"
2. Prompt auto-fills in input field
3. Message sends automatically
4. AI response appears in 2-3 seconds (Groq processing)

### Step 4: Send Custom Message
1. Type in input field: "What's a good wedding budget for 100 guests?"
2. Press Enter or click send button
3. Message appears as blue bubble on right
4. AI response appears as white bubble on left
5. Response uses your wedding details for context

### Step 5: Verify Chat History
1. Close widget (click X button)
2. Open widget again (click floating button)
3. Previous messages are still there
4. Scroll up to see full conversation

### Expected UI
```
Chat Widget
├── Header
│   ├── Sparkles icon + "Vivaha AI"
│   ├── "Wedding expert" subtitle
│   └── X button to close
├── Messages Area
│   ├── Quick prompts (if empty chat)
│   ├── Your messages (blue, right-aligned)
│   ├── AI responses (white, left-aligned)
│   └── Loading dots (while thinking)
└── Input Area
    ├── Text input field
    └── Send button (arrow icon)
```

---

## Testing Mobile Responsiveness

### Registry Manager Mobile
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Set to iPhone 12 Pro (390px width)
4. Verify:
   - Registry cards stack in single column
   - Add button still visible and clickable
   - Modal dialog responsive

### AI Assistant Mobile
1. Same DevTools setup
2. Verify:
   - Floating button still visible
   - Widget adjusts width (max-w-96 with padding)
   - Chat readable
   - Input field accessible
   - Touch-friendly buttons

---

## Testing Offline Functionality

### Registry Manager Offline
1. Add a registry and close browser tab
2. Open DevTools Network tab
3. Go offline: DevTools → Network → Throttling → Offline
4. Navigate back to Registries page
5. Verify:
   - Registries still display from localStorage
   - Previous registry data is there
   - Add/edit shows but won't sync (expected)

### AI Assistant Offline
1. Chat history loaded from localStorage
2. When offline:
   - Can see previous messages
   - Can type new messages
   - Send fails (expected - no API)
   - Error message shown

---

## Testing with Different User Data

### Scenario 1: Couple Planning Wedding
1. Login with account that has wedding details filled
2. Check AI assistant system prompt includes:
   - Wedding style
   - Location
   - Budget
   - Guest count
   - Priorities
3. Ask "How should I allocate my budget?"
4. Response should reference their actual budget

### Scenario 2: Planner
1. Login as planner account
2. Try accessing Registries - should be available
3. Try AI Assistant - should be available but generic
4. Verify different permissions if any

---

## Debugging Tips

### Registry Manager Issues
```javascript
// Check localStorage in DevTools Console
localStorage.getItem('registries')

// Check API calls
// Open Network tab → filter "registries"
// Should see GET /api/registries on page load
```

### AI Assistant Issues
```javascript
// Check chat history in localStorage
localStorage.getItem('aiChatHistory')

// Check API calls
// Open Network tab → filter "ai/chat"
// Should see POST request and response

// Check console for errors
// Open DevTools Console
// Look for any 403, 500 errors
```

### MongoDB Issues
```bash
# Check if registries collection exists
# Connect to MongoDB:
mongo
use vivaha  # or your db name
db.registries.find().limit(5)
```

---

## Expected API Responses

### GET /api/registries
```json
[
  {
    "_id": "mongoId123",
    "userId": "userId456",
    "name": "My Zola Registry",
    "type": "zola",
    "url": "https://www.zola.com/wedding...",
    "notes": "Optional notes here",
    "addedAt": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

### POST /api/ai/chat
```json
{
  "reply": "For your $50,000 budget with 100 guests, consider: 40% venue ($20k), 20% catering ($10k), 15% photography ($7.5k), 15% flowers & decor ($7.5k), 10% other ($5k)..."
}
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Registries not saving | Check token in localStorage, verify JWT not expired |
| AI returns generic response | Ensure onboarding data is saved (wedding details) |
| Widget not visible | Check z-index, refresh page, ensure authenticated |
| 403 Forbidden on registry API | Check Authorization header with Bearer token |
| MongoDB connection error | Verify MONGODB_URI in .env, check if mongod running |
| GROQ API errors | Verify GROQ_API_KEY set, check API quota |

---

## Success Criteria ✅

Registry Manager working if:
- ✅ Can add/edit/delete registries
- ✅ Data persists across page reloads
- ✅ Multiple registries display in grid
- ✅ All registry types (Zola, Amazon, etc.) work
- ✅ localStorage fallback works offline

AI Assistant working if:
- ✅ Floating button visible on all pages
- ✅ Widget opens/closes properly
- ✅ Quick prompts send and get responses
- ✅ Custom messages get personalized responses
- ✅ Chat history persists
- ✅ Mobile responsive

---

## Next Steps for Production

1. **Error Handling:** Add toast notifications for failures
2. **Loading States:** Show spinners during registry operations
3. **Validation:** Add URL validation for registry links
4. **Analytics:** Track registry views by type
5. **Guest Access:** Share registry links publicly
6. **AI Improvements:** Add more prompt templates
7. **Feedback:** Save user feedback on AI responses

---

**For issues or questions, check commit `f2f12bc` in git history**
