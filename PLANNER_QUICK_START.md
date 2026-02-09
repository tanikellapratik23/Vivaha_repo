# 🚀 Quick Start - Wedding Planner Workspace System

## What's New?

When users select **"Wedding Planner"** during onboarding, they now get a professional workspace-based dashboard system instead of the regular couple dashboard.

## Testing It Out

### 1. Test Account Setup
```bash
# Option A: Use existing planner account
Email: planner@test.com
Password: [your test password]

# Option B: Create new account
- Register
- Onboarding → Select "Wedding Planner"
- You'll be routed to /dashboard/planner
```

### 2. What You'll See
- **Landing Page**: "Your Weddings" - Grid of all wedding projects
- **Top Navigation**: VivahaPlan logo + workspace switcher + settings + logout
- **Empty State**: Button to create your first wedding

### 3. Create Your First Wedding
1. Click **"Create New Wedding"** button
2. Enter wedding name (e.g., "Ayesha & Ryan – Oct 2026")
3. Add optional notes
4. Click **"Continue"**
5. Select wedding date
6. Choose wedding type (interfaith, religious, etc)
7. Click **"Create Wedding"**
8. Redirected to wedding dashboard

### 4. Test Features
- ✅ Create multiple weddings
- ✅ Click to open wedding
- ✅ Use top nav switcher to switch between weddings
- ✅ Search/filter weddings
- ✅ Right-click menu: rename, duplicate, archive, delete
- ✅ View progress indicators
- ✅ See aggregate stats

## File Locations

### Backend (Server)
```
server/src/
├── models/
│   └── WeddingWorkspace.ts
└── routes/
    └── workspaces.ts
```

### Frontend (Client)
```
client/src/components/dashboard/
├── PlannerDashboard.tsx
├── PlannerWorkspaceHome.tsx
├── CreateWeddingModal.tsx
├── WorkspaceSwitcher.tsx
└── PlannerOverview.tsx
```

## API Endpoints to Test

```bash
# Get all workspaces
curl -X GET http://localhost:3000/api/workspaces \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Create workspace
curl -X POST http://localhost:3000/api/workspaces \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ayesha & Ryan – Oct 2026",
    "weddingDate": "2026-10-15",
    "weddingType": "interfaith",
    "notes": "Optional notes"
  }'

# Get single workspace
curl -X GET http://localhost:3000/api/workspaces/WORKSPACE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"

# Rename workspace
curl -X PATCH http://localhost:3000/api/workspaces/WORKSPACE_ID/rename \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Name"}'

# Archive workspace
curl -X PATCH http://localhost:3000/api/workspaces/WORKSPACE_ID/archive \
  -H "Authorization: Bearer YOUR_TOKEN"

# Duplicate workspace
curl -X POST http://localhost:3000/api/workspaces/WORKSPACE_ID/duplicate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"newName": "Copy Name"}'

# Delete workspace
curl -X DELETE http://localhost:3000/api/workspaces/WORKSPACE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## User Flow to Test

```
1. Register
   ↓
2. Onboarding → Select "Wedding Planner" role
   ↓
3. Lands on /dashboard/planner
   ↓
4. See "Your Weddings" empty state
   ↓
5. Click "Create New Wedding"
   ↓
6. Fill 2-step form
   ↓
7. Auto-redirected to wedding dashboard
   ↓
8. See workspace switcher in top nav
   ↓
9. Create 2nd wedding, switch between them
   ↓
10. Go back to home → see both weddings
```

## Styling & Colors

All components use the existing Vivaha color palette:
- **Primary**: Pink (`#ec4899`)
- **Gradients**: Pink → Rose
- **Tailwind**: Compatible with your existing setup

No new colors added - fully consistent with existing design.

## Key Components Explained

### PlannerDashboard (Main Container)
- Top navigation bar with branding
- Workspace switcher (top right)
- Logout button
- Routes all planner views

### PlannerWorkspaceHome (Grid View)
- Shows all wedding workspaces
- Search across weddings
- Filter by status
- Each card shows:
  - Wedding name
  - Wedding date
  - Status badge
  - Progress bar
  - Task count
  - Vendor count
  - Last activity

### CreateWeddingModal
- Step 1: Name + notes
- Step 2: Date + type
- Form validation
- Error handling
- Loading states

### WorkspaceSwitcher
- Dropdown in top nav
- Searchable list
- Quick navigation
- Back to home button

## Testing Checklist

```
[ ] Create wedding workspace
[ ] View workspace grid
[ ] Search workspaces
[ ] Filter by status
[ ] Click to open wedding
[ ] See workspace switcher
[ ] Switch between weddings
[ ] Go back to workspace home
[ ] Rename workspace
[ ] Duplicate workspace
[ ] Archive workspace
[ ] Delete workspace (with confirmation)
[ ] Verify data isolation (create tasks in 2 weddings)
[ ] Check responsive design (mobile/tablet)
[ ] Test error states
[ ] Verify auth is required
```

## Common Issues & Solutions

### Issue: Planners not seeing workspace home
**Solution**: Check that onboarding correctly routes planners to `/dashboard/planner`

### Issue: Workspace switcher not showing
**Solution**: Make sure PlannerDashboard component is rendered when `isPlanner=true`

### Issue: Data showing across weddings
**Solution**: Each wedding needs `workspace_id` in all data models (next phase)

### Issue: Can't create workspace
**Solution**: Check API is running and token is valid

## Environment Variables

No new environment variables needed - uses existing:
```
VITE_API_URL=http://localhost:3000
MONGODB_URI=your_mongo_connection
```

## Next: Data Isolation

Currently, existing dashboard features (tasks, vendors, etc) show all data.

To complete data isolation, update these models to include `workspace_id`:
- `Todo.ts` - Add `workspace_id`
- `Vendor.ts` - Add `workspace_id`
- `BudgetCategory.ts` - Add `workspace_id`
- `Guest.ts` - Add `workspace_id`
- `Post.ts` - Add `workspace_id`

This ensures couples' and planners' data never mixes.

## Performance Notes

- Workspaces endpoint: Indexed by `planner_id` + `status`
- Grid loads all workspaces in one query
- Search/filter happens client-side
- Switching between workspaces is instant

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

## Accessibility

- ✅ Keyboard navigation
- ✅ ARIA labels on buttons
- ✅ Color contrast meets WCAG standards
- ✅ Focus indicators visible
- ✅ Form validation messages clear

---

## Questions?

Refer to:
- `PLANNER_WORKSPACE_SYSTEM.md` - Full technical details
- `PLANNER_IMPLEMENTATION_SUMMARY.md` - Implementation guide
- Component JSDoc comments - Inline documentation

**Happy testing!** 🎉
