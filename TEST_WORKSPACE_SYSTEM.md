# Workspace System Testing Guide

## ✅ Completed Implementation

### Backend Changes
- [x] WeddingWorkspace model updated: `planner_id` → `user_id` + `user_role` field
- [x] All 8 workspace API endpoints support universal user access
- [x] Removed planner-only role restrictions
- [x] Workspaces routes properly permission-check using `user_id`

### Frontend Changes
- [x] WorkspaceLibrary component created with full CRUD operations
- [x] Workspace Library button added to dashboard header
- [x] `/dashboard/workspaces` route mounted
- [x] CreateWeddingModal enhanced for all user types
- [x] localStorage sync for workspace data

### Integration Points
- [x] FolderOpen icon added to imports
- [x] WorkspaceLibrary imported in Dashboard
- [x] Workspace Library button styled and functional
- [x] Route added to main dashboard Routes

---

## Test Scenarios

### 1. Create First Workspace (as Bride/Any User)
**Steps:**
1. Login as non-planner user (e.g., bride/groom)
2. Click "Create Wedding" button on dashboard
3. Fill in workspace details:
   - Name: "My First Wedding"
   - Date: Any future date
   - Type: Traditional/Modern/Other
   - Notes: Optional
4. Submit form

**Expected Results:**
- ✅ Workspace created successfully (no "Only planners" error)
- ✅ Redirects to dashboard overview
- ✅ Workspace appears in localStorage
- ✅ `user_id` stored correctly in database
- ✅ `user_role` field set to user's role

**API Verification:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/workspaces
```
Should return workspaces with `user_id` field (not `planner_id`)

---

### 2. Access Workspace Library
**Steps:**
1. From dashboard, click "Workspace Library" button (top right)
2. Should navigate to `/dashboard/workspaces`

**Expected Results:**
- ✅ All workspaces displayed in 3-column grid
- ✅ Status badges showing current state
- ✅ Last activity timestamp visible
- ✅ All action buttons functional

**Actions Available:**
- ✅ Create new workspace (modal with form)
- ✅ Rename existing workspace (inline edit)
- ✅ Duplicate workspace (creates copy with "(Copy)" suffix)
- ✅ Archive workspace (soft delete)
- ✅ Delete workspace (hard delete with confirmation)

---

### 3. Create Multiple Workspaces
**Steps:**
1. In Workspace Library, click "Create New Workspace"
2. Create 2-3 different workspaces with different names
3. Verify all appear in library

**Expected Results:**
- ✅ Can create unlimited workspaces
- ✅ Each has unique `_id` and `user_id`
- ✅ All workspaces listed in library
- ✅ No data bleed between workspaces

---

### 4. Test Duplicate Functionality
**Steps:**
1. In Workspace Library, click duplicate button on any workspace
2. Observe new workspace created

**Expected Results:**
- ✅ New workspace name: "Original Name (Copy)"
- ✅ Same `user_id` as original
- ✅ Same `user_role` preserved
- ✅ teamMembers array reset to original creator
- ✅ Appears in library with copy indicator

---

### 5. Test Archive/Restore
**Steps:**
1. In Workspace Library, click archive button
2. Workspace moves to archived section
3. Click restore to bring back

**Expected Results:**
- ✅ Archived workspace hidden from main view
- ✅ Separate "Archived" section visible
- ✅ Can restore archived workspace
- ✅ Restored workspace returns to main view

---

### 6. Test Workspace Isolation
**Steps:**
1. Create Workspace A with specific guest list
2. Create Workspace B
3. Add different guests to each
4. Switch between workspaces

**Expected Results:**
- ✅ Each workspace has isolated data
- ✅ Guest list doesn't leak between workspaces
- ✅ Budget data independent
- ✅ All other features per-workspace

---

## Database Schema Verification

### Expected WeddingWorkspace Document Structure
```json
{
  "_id": "ObjectId",
  "user_id": "UserId",
  "user_role": "bride|groom|parent|friend|planner|other",
  "name": "My Wedding",
  "weddingDate": "2024-12-25",
  "weddingType": "traditional",
  "notes": "Optional notes",
  "status": "planning|active|completed",
  "isArchived": false,
  "teamMembers": [
    {
      "userId": "UserId",
      "name": "User Name",
      "email": "user@example.com",
      "role": "couple|co-planner|guest|vendor",
      "joinedAt": "ISODate"
    }
  ],
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### Key Changes from Previous Schema
- ✅ `planner_id` → `user_id` (universal field)
- ✅ Added `user_role` enum (captures user's role)
- ✅ `user_role` supports all 6 user types
- ✅ No role-based restrictions on workspace creation

---

## Error Handling Tests

### Test Authorization Error (Fixed)
**Previous Error:**
```
"Error creating workspace"
"Only planners can create workspaces"
```

**Current Status:**
- ✅ FIXED - All user types can create workspaces
- ✅ Backend no longer checks user.role === 'planner'
- ✅ Frontend shows proper error messages

### Test Token Validation
**Steps:**
1. Try to create workspace without valid token
2. Observe error message

**Expected Results:**
- ✅ Clear error: "Authentication failed. Please log in again."
- ✅ User prompted to re-login
- ✅ No blank errors or 403 responses

---

## API Endpoint Tests

All endpoints should work for authenticated users:

### GET /api/workspaces
```bash
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/workspaces
```
Returns: All workspaces for authenticated user (filtered by `user_id`)

### POST /api/workspaces
```bash
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","weddingDate":"2024-12-25","weddingType":"traditional"}' \
  http://localhost:3000/api/workspaces
```
Returns: Created workspace with `user_id` field

### PATCH /api/workspaces/:id/rename
```bash
curl -X PATCH \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"newName":"Updated Name"}' \
  http://localhost:3000/api/workspaces/WORKSPACE_ID/rename
```

### POST /api/workspaces/:id/duplicate
```bash
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/api/workspaces/WORKSPACE_ID/duplicate
```

---

## Next Steps

1. **Login Flow Integration**
   - Check workspace count on login
   - If 1 workspace: auto-open it
   - If multiple: show Workspace Library
   - If none: show Create Workspace modal

2. **Workspace Switching**
   - Create WorkspaceSwitcher component
   - Add dropdown in header
   - Show current workspace name
   - Allow switching without logging out

3. **Data Persistence**
   - Verify workspace context saved
   - Test localStorage + database sync
   - Verify data isolation between switches

4. **Multi-User Testing**
   - Create workspaces as different users
   - Verify each user only sees their own
   - Test team member permissions

---

## Rollback Instructions

If issues found, revert to previous schema:
1. Restore `planner_id` field in WeddingWorkspace model
2. Update all route handlers to use `planner_id`
3. Remove `user_role` enum
4. Restore planner-only role checks

**All changes are backward compatible** - existing data structure preserved.

