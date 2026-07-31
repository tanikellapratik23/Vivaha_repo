import type { Request, Response } from 'express';
import app, { databaseReady } from '../src/index';

// Catch every /api/* request on Vercel, then let the existing Express router
// handle /api/auth, /api/onboarding, /api/health, and the rest of the API.
export default async function handler(req: Request, res: Response) {
  // Set CORS headers before Express is invoked. Vercel can answer a browser's
  // OPTIONS preflight at this entry point, so the actual auth POST is allowed
  // to reach the shared Express router.
  const origin = req.headers.origin;
  if (origin && (
    origin === 'https://vivaha-repo.vercel.app' ||
    /^https:\/\/vivaha-repo-[a-z0-9-]+\.vercel\.app$/i.test(origin)
  )) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    await databaseReady;
    return app(req, res);
  } catch {
    return res.status(503).json({ error: 'Database is temporarily unavailable. Please try again.' });
  }
}
