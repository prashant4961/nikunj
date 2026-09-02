import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from './env';

export type TokenPayload = { userId: number; role: 'CUSTOMER' | 'ADMIN' };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: TokenPayload;
    }
  }
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: '7d' });
}

function readToken(req: Request): TokenPayload | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(header.slice(7), env.jwtSecret) as TokenPayload;
  } catch {
    return null;
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const payload = readToken(req);
  if (payload) req.auth = payload;
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const payload = readToken(req);
  if (!payload) return res.status(401).json({ message: 'Please log in to continue' });
  req.auth = payload;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const payload = readToken(req);
  if (!payload) return res.status(401).json({ message: 'Please log in to continue' });
  if (payload.role !== 'ADMIN') return res.status(403).json({ message: 'Admin access required' });
  req.auth = payload;
  next();
}
