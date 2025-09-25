import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { AuthTokenPayload } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Missing or invalid authorization header' }, 401);
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    c.set('user', payload);
    await next();
  } catch (error) {
    return c.json({ success: false, error: 'Invalid or expired token' }, 401);
  }
}

export async function optionalAuthMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const payload = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
      c.set('user', payload);
    } catch (error) {
      // Continue without user context if token is invalid
    }
  }
  
  await next();
}

export function generateToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function requireRole(role: string) {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as AuthTokenPayload;
    
    if (!user) {
      return c.json({ success: false, error: 'Authentication required' }, 401);
    }
    
    if (user.role !== role && user.role !== 'admin') {
      return c.json({ success: false, error: 'Insufficient permissions' }, 403);
    }
    
    await next();
  };
}
