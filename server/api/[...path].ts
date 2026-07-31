import type { Request, Response } from 'express';
import app, { databaseReady } from '../src/index';

// Catch every /api/* request on Vercel, then let the existing Express router
// handle /api/auth, /api/onboarding, /api/health, and the rest of the API.
export default async function handler(req: Request, res: Response) {
  try {
    await databaseReady;
    return app(req, res);
  } catch {
    return res.status(503).json({ error: 'Database is temporarily unavailable. Please try again.' });
  }
}
