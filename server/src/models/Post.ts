import mongoose, { Schema, Document } from 'mongoose';

interface IComment {
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface IPost extends Document {
  userId: string;
  userName: string;
  postType: 'photo' | 'blog';
  category: 'wedding-rave' | 'app-feedback';
  content: string;
  photoUrl?: string;
  location?: string;
  tags: string[];
  likes: number;
  likedBy: string[];
  comments: IComment[];
  appRating?: number;
  createdAt: Date;
}

const CommentSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new Schema<IPost>(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    postType: { type: String, enum: ['photo', 'blog'], required: true },
    category: { type: String, enum: ['wedding-rave', 'app-feedback'], required: true },
    content: { type: String, required: true },
    photoUrl: String,
    location: String,
    tags: [String],
    likes: { type: Number, default: 0 },
    likedBy: [String],
    comments: [CommentSchema],
    appRating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>('Post', PostSchema);
