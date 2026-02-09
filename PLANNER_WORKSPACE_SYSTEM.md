# Wedding Planner Workspace Dashboard System

## Overview

The Wedding Planner Workspace Dashboard is a professional, SaaS-style system that allows wedding planners to manage multiple wedding projects independently. Each wedding functions as its own isolated workspace with separate data, tasks, vendors, budgets, and team access controls.

## Architecture

### Database Models

#### WeddingWorkspace
Located in `server/src/models/WeddingWorkspace.ts`

```typescript
interface IWeddingWorkspace {
  planner_id: ObjectId;          // Reference to User (planner)
  name: string;                   // e.g., "Ayesha & Ryan – Oct 2026"
  weddingDate: Date;
  weddingType: string;            // 'interfaith' | 'religious' | 'secular' | 'destination'
  status: string;                 // 'planning' | 'active' | 'completed' | 'archived'
  lastActivity: Date;
  teamMembers: Array<{
    userId: ObjectId;
    role: 'planner' | 'assistant' | 'couple' | 'viewer';
    email: string;
  }>;
  progressMetrics: {
    tasksCompleted: number;
    tasksTotal: number;
    vendorsBooked: number;
    budgetAllocated: number;
  };
  settings: {
    color_theme?: string;
    archived: boolean;
    archiveDate?: Date;
  };
}
```

### API Endpoints

All endpoints are protected with authentication middleware.

#### Workspace Management
- `GET /api/workspaces` - Get all active workspaces for the planner
- `GET /api/workspaces/:workspaceId` - Get single workspace details
- `POST /api/workspaces` - Create new wedding workspace
- `PUT /api/workspaces/:workspaceId` - Update workspace details
- `PATCH /api/workspaces/:workspaceId/rename` - Rename workspace
- `PATCH /api/workspaces/:workspaceId/archive` - Archive workspace
- `PATCH /api/workspaces/:workspaceId/restore` - Restore archived workspace
- `POST /api/workspaces/:workspaceId/duplicate` - Duplicate workspace for template reuse
- `DELETE /api/workspaces/:workspaceId` - Hard delete workspace

### Frontend Components

#### PlannerDashboard
Main container that manages the planner experience. Located in `client/src/components/dashboard/PlannerDashboard.tsx`

- Displays top navigation bar with branding and user controls
- Integrates workspace switcher for quick navigation
- Manages modal state for creating new weddings
- Routes to specific workspace dashboards when selected

#### PlannerWorkspaceHome
Landing page after planner login. Shows all wedding workspaces in a grid/list view.

**Features:**
- Grid display of wedding workspace cards
- Search functionality across weddings
- Filter by status (all, planning, active, completed)
- Quick actions: rename, duplicate, archive, delete
- Progress indicators for each wedding
- Last activity timestamps
- Status badges with color coding

**Color Scheme:**
- Planning: Blue (`bg-blue-50 text-blue-700`)
- Active: Green (`bg-green-50 text-green-700`)
- Completed: Purple (`bg-purple-50 text-purple-700`)
- Archived: Gray

#### CreateWeddingModal
Two-step modal for creating new wedding workspaces.

**Step 1: Basic Information**
- Wedding name (required)
- Optional notes

**Step 2: Details**
- Wedding date (required)
- Wedding type selector (interfaith, religious, secular, destination, other)

**Features:**
- Smooth progress indicator
- Form validation
- Loading state
- Error handling

#### WorkspaceSwitcher
Dropdown component in the top navigation for quick workspace switching.

**Features:**
- Dropdown list of all workspaces
- Search within workspaces
- Status badges for each workspace
- Quick access to "Back to All Weddings"
- Instant switching between workspaces

#### PlannerOverview
Dashboard overview component showing aggregate statistics.

**Displays:**
- Total weddings count
- Active/upcoming/completed breakdown
- Overall task completion percentage
- Vendors booked across all weddings
- Total budget allocated
- Quick action buttons

## User Flow

### 1. Onboarding → Planner Selection
When user selects "Wedding Planner" during role selection, they are routed to `/dashboard/planner` instead of the regular `/dashboard`.

### 2. Workspace Home
Planner lands on PlannerWorkspaceHome showing all their wedding projects.

**Actions available:**
- Create new wedding
- Search/filter weddings
- Click to open specific wedding
- Open menu to: rename, duplicate, archive, delete

### 3. Inside a Workspace
When planner selects a wedding, they access that workspace's dedicated dashboard with:
- Workspace switcher in top nav for quick switching
- All normal dashboard features (tasks, vendors, budget, etc.)
- Data isolated to this wedding only
- Team member management specific to this wedding

### 4. Workspace Management
From workspace home, planners can:
- **Create**: Add new wedding projects
- **Rename**: Update wedding name
- **Duplicate**: Clone weddings as templates
- **Archive**: Hide inactive weddings (still retrievable)
- **Restore**: Unarchive previously archived weddings
- **Delete**: Permanently remove with confirmation

## Data Isolation

Each workspace maintains completely isolated data:
- Tasks are scoped to `workspace_id`
- Vendors are scoped to `workspace_id`
- Budget entries are scoped to `workspace_id`
- Files/messages are scoped to `workspace_id`
- Team permissions are workspace-specific

### Migration Path
Existing models will need to be updated to include `workspace_id`:
```typescript
// Example: Todo model
{
  workspace_id: ObjectId;    // NEW: References WeddingWorkspace
  // ... existing fields
}
```

## Visual Design System

### Color Palette
Uses existing Vivaha primary colors with extended palette:
- **Primary**: Pink (`#ec4899`)
- **Gradients**: Pink → Rose
- **Status Colors**: Blue, Green, Purple, Gray
- **Backgrounds**: Slate 50-100 with subtle gradients

### Typography
- **Headers**: Bold, 3-4xl for main titles
- **Subheaders**: Semibold, lg-xl
- **Body**: Regular/medium, sm-base
- **Labels**: Small, medium weight

### Component Spacing
- Card padding: 6 units (24px)
- Grid gaps: 4-6 units (16-24px)
- Section margins: 8 units (32px)

## Future Enhancements

### Phase 2: Templates
- Save workspace templates for recurring wedding styles
- Clone templates quickly
- Custom template library

### Phase 3: Team Collaboration
- Invite team members (assistants, couples) to specific workspaces
- Role-based permissions (viewer, editor, manager)
- Workspace-specific notifications

### Phase 4: Analytics
- Planner portfolio analytics
- Revenue tracking per wedding
- Team performance metrics
- Client satisfaction ratings

### Phase 5: Pricing Tiers
- Free tier: 1 wedding
- Pro tier: 5 weddings
- Business tier: Unlimited weddings + team features
- Enterprise: Custom solutions

## Technical Implementation Notes

1. **Authentication**: All workspace endpoints require JWT token
2. **Authorization**: Verify planner owns workspace before access
3. **Indexing**: Workspace queries indexed by `planner_id` and `status` for performance
4. **Archiving**: Soft delete using `settings.archived` flag to preserve data
5. **Last Activity**: Updated on every workspace modification for sorting

## File Structure
```
client/src/components/dashboard/
├── PlannerDashboard.tsx           (Main container)
├── PlannerWorkspaceHome.tsx       (Workspace library)
├── CreateWeddingModal.tsx         (Create flow)
├── WorkspaceSwitcher.tsx          (Top nav switcher)
├── PlannerOverview.tsx            (Dashboard stats)
└── Dashboard.tsx                  (Updated with planner routing)

server/src/
├── models/
│   └── WeddingWorkspace.ts        (Database schema)
└── routes/
    └── workspaces.ts             (API endpoints)
```

## Testing Checklist

- [ ] Create wedding workspace
- [ ] Update workspace name
- [ ] Archive/restore workspace
- [ ] Duplicate workspace
- [ ] Delete workspace
- [ ] Switch between workspaces
- [ ] Search/filter workspaces
- [ ] View workspace details
- [ ] Verify data isolation between workspaces
- [ ] Test team member invitations
- [ ] Verify permissions enforcement
