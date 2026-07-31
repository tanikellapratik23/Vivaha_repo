import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import onboardingRoutes from './routes/onboarding';
import guestRoutes from './routes/guests';
import budgetRoutes from './routes/budget';
import todoRoutes from './routes/todos';
import vendorRoutes from './routes/vendors';
import seatingRoutes from './routes/seating';
import sharingRoutes from './routes/sharing';
import bachelorTripRoutes from './routes/bachelorTrip';
import emailRoutes from './routes/email';
import adminRoutes from './routes/admin';
import navigationRoutes from './routes/navigation';
import postsRoutes from './routes/posts';
import weddingPageRoutes from './routes/weddingPage';
import aiRoutes from './routes/ai';
import userDataRoutes from './routes/userdata';
import workspacesRoutes from './routes/workspaces';
import registriesRoutes from './routes/registries';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Reflect browser origins so the separately deployed Vercel client can make
// authenticated API requests. Authorization remains enforced per route.
app.use(cors({ origin: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/seating', seatingRoutes);
app.use('/api/sharing', sharingRoutes);
app.use('/api/bachelor-trip', bachelorTripRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/navigation', navigationRoutes);
app.use('/api/wedding-page', weddingPageRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/workspaces', workspacesRoutes);
app.use('/api', emailRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userDataRoutes);
app.use('/api/registries', registriesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Vivaha API is running' });
});

// Reuse one connection across Vercel function invocations.  Local development
// still starts a normal Express server below.
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wedwise';

export const databaseReady = mongoose
  .connect(MONGODB_URI, {
    maxPoolSize: 10,
    minPoolSize: 5,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('✅ Connected to MongoDB with optimized connection pooling');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  });

// Vercel invokes the exported Express app through server/api/index.ts. Only
// open a port when this package is run locally or on a conventional host.
if (!process.env.VERCEL) {
  databaseReady
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    })
    .catch(() => process.exit(1));
}

export default app;
