import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  isAdmin?: boolean;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Allow localhost development access without token
    if (process.env.NODE_ENV !== 'production') {
      const origin = req.get('origin');
      const host = req.get('host');
      
      // Allow localhost/127.0.0.1 in development to skip auth for admin endpoints
      if ((origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) || 
          (host && (host.includes('localhost') || host.includes('127.0.0.1')))) {
        req.userId = 'local-dev-admin';
        req.isAdmin = true;
        console.log('✅ Development mode: Allowing localhost access to admin endpoints');
        next();
        return;
      }
    }

    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      console.error('❌ No token provided in Authorization header');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string; isAdmin?: boolean };
      req.userId = decoded.userId;
      req.isAdmin = decoded.isAdmin || false;
      next();
    } catch (jwtError: any) {
      console.error('❌ JWT verification failed:', jwtError.message);
      return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    }
  } catch (error: any) {
    console.error('❌ Auth middleware error:', error.message);
    res.status(401).json({ error: 'Authentication failed.' });
  }
};
