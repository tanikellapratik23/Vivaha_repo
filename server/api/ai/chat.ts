import type { Request, Response } from 'express';
import app, { databaseReady } from '../../src/index';

// Vercel's catch-all function can serve one-level API paths but has proven
// unreliable for nested paths in this deployment. Keep AI chat as an explicit
// function so /api/ai/chat always reaches the Express router.
export default async function handler(req: Request, res: Response) {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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
