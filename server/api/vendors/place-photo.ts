import type { Request, Response } from 'express';
import axios from 'axios';

// Google Places photo proxy: the Maps key remains on the server.
export default async function handler(req: Request, res: Response) {
  const photoName = typeof req.query.name === 'string' ? req.query.name : '';
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!photoName || !key) return res.status(404).end();
  try {
    const photo = await axios.get(`https://places.googleapis.com/v1/${photoName}/media`, {
      params: { maxHeightPx: 500, maxWidthPx: 700, key },
      responseType: 'arraybuffer',
      maxRedirects: 3,
    });
    res.setHeader('Content-Type', photo.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(Buffer.from(photo.data));
  } catch { return res.status(404).end(); }
}
