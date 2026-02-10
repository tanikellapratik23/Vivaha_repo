import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistry extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: 'zola' | 'amazon' | 'target' | 'bed-bath-beyond' | 'other';
  url: string;
  notes?: string;
  addedAt: Date;
}

const RegistrySchema = new Schema<IRegistry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['zola', 'amazon', 'target', 'bed-bath-beyond', 'other'],
      default: 'other',
    },
    url: { type: String, required: true },
    notes: { type: String },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IRegistry>('Registry', RegistrySchema);
