import type { NextFunction, Response } from 'express';
import { auth } from '../services/firestore.js';
import type { AuthenticatedRequest } from '../types.js';

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const token = header.replace('Bearer ', '').trim();
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const decoded = await auth.verifyIdToken(token);
    req.user = { uid: decoded.uid };
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
