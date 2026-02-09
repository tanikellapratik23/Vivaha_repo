import mongoose, { Schema, Document } from 'mongoose';

export interface IWeddingWorkspace extends Document {
  user_id: mongoose.Types.ObjectId; // Reference to User (any user type)
  user_role?: 'bride' | 'groom' | 'parent' | 'friend' | 'planner' | 'other'; // User's role for this workspace
  name: string; // e.g., "Ayesha & Ryan – Oct 2026"
  weddingDate: Date;
  weddingType: 'interfaith' | 'religious' | 'secular' | 'destination' | 'other';
  notes?: string;
  status: 'planning' | 'active' | 'completed' | 'archived';
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;

  // Workspace-specific data
  teamMembers: Array<{
    userId: mongoose.Types.ObjectId;
    role: 'planner' | 'assistant' | 'couple' | 'viewer';
    email: string;
    addedAt: Date;
  }>;

  // Progress tracking
  progressMetrics?: {
    tasksCompleted: number;
    tasksTotal: number;
    vendorsBooked: number;
    budgetAllocated: number;
  };

  // Settings
  settings?: {
    color_theme?: string;
    archived?: boolean;
    archiveDate?: Date;
  };

  // Isolated data references (will have workspace_id in their models)
  // Tasks, Vendors, Budget, Files, Messages are all scoped to this workspace
}

const WeddingWorkspaceSchema = new Schema<IWeddingWorkspace>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user_role: {
    type: String,
    enum: ['bride', 'groom', 'parent', 'friend', 'planner', 'other'],
    default: 'bride',
  },
  name: {
    type: String,
    required: true,
  },
  weddingDate: {
    type: Date,
    required: true,
  },
  weddingType: {
    type: String,
    enum: ['interfaith', 'religious', 'secular', 'destination', 'other'],
    default: 'secular',
  },
  notes: String,
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'archived'],
    default: 'planning',
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  teamMembers: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      role: {
        type: String,
        enum: ['planner', 'assistant', 'couple', 'viewer'],
        default: 'viewer',
      },
      email: String,
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  progressMetrics: {
    tasksCompleted: { type: Number, default: 0 },
    tasksTotal: { type: Number, default: 0 },
    vendorsBooked: { type: Number, default: 0 },
    budgetAllocated: { type: Number, default: 0 },
  },
  settings: {
    color_theme: String,
    archived: { type: Boolean, default: false },
    archiveDate: Date,
  },
});

WeddingWorkspaceSchema.index({ user_id: 1 });
WeddingWorkspaceSchema.index({ status: 1 });
WeddingWorkspaceSchema.index({ user_id: 1, status: 1 });

export default mongoose.model<IWeddingWorkspace>('WeddingWorkspace', WeddingWorkspaceSchema);
