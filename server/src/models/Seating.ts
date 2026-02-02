import mongoose, { Schema } from 'mongoose';

interface ISeating {
  userId: string;
  tables: Array<{
    id: string;
    name: string;
    capacity: number;
    shape: 'round' | 'rectangle';
    x: number;
    y: number;
    guests: Array<{
      id: string;
      name: string;
    }>;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const SeatingSchema = new Schema<ISeating>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  tables: [
    {
      id: String,
      name: String,
      capacity: Number,
      shape: {
        type: String,
        enum: ['round', 'rectangle'],
        default: 'round',
      },
      x: Number,
      y: Number,
      guests: [
        {
          id: String,
          name: String,
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Seating = mongoose.model<ISeating>('Seating', SeatingSchema);

export default Seating;
