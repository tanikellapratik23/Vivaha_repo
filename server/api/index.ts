import type { Request, Response } from 'express';
import app, { databaseReady } from '../src/index';

// Vercel serverless entry point. Waiting for MongoDB here ensures an API call
// never reaches a route before the database connection is ready.
export default async function handler(req: Request, res: Response) {
  try {
    await databaseReady;
    return app(req, res);
  } catch {
    return res.status(503).json({ error: 'Database is temporarily unavailable. Please try again.' });
  }
}
