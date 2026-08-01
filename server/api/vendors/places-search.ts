import type { Request, Response } from 'express';
import app, { databaseReady } from '../../src/index';

export default async function handler(req: Request, res: Response) {
  const origin = req.headers.origin;
  if (origin) { res.setHeader('Access-Control-Allow-Origin', origin); res.setHeader('Vary', 'Origin'); }
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try { await databaseReady; return app(req, res); }
  catch { return res.status(503).json({ error: 'Database is temporarily unavailable. Please try again.' }); }
}
