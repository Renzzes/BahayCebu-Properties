import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { prisma } from '../_db';

export interface AuthenticatedRequest extends VercelRequest {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

/**
 * Middleware to validate JWT tokens and authenticate users
 */
export async function authenticateToken(
  req: AuthenticatedRequest,
  res: VercelResponse,
  next?: () => void
): Promise<boolean> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        error: 'Access denied',
        message: 'No authentication token provided'
      });
      return false;
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      res.status(500).json({
        error: 'Server configuration error',
        message: 'Authentication service is not properly configured'
      });
      return false;
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'bahaycebu-properties',
      audience: 'bahaycebu-users'
    }) as JWTPayload;

    // Validate token structure
    if (!decoded.userId || !decoded.email) {
      res.status(401).json({
        error: 'Invalid token',
        message: 'Token does not contain required user information'
      });
      return false;
    }

    // Optional: Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      res.status(401).json({
        error: 'Invalid token',
        message: 'User associated with this token no longer exists'
      });
      return false;
    }

    // Attach user info to request
    req.user = user;
    
    if (next) next();
    return true;

  } catch (error: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Token validation error:', error);
    }

    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        error: 'Token expired',
        message: 'Your session has expired. Please log in again.'
      });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        error: 'Invalid token',
        message: 'The provided token is invalid'
      });
    } else {
      res.status(500).json({
        error: 'Authentication error',
        message: 'An error occurred while validating your session'
      });
    }
    
    return false;
  }
}

/**
 * Rate limiting helper (simple in-memory implementation)
 * In production, consider using Redis or a proper rate limiting service
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(
  req: VercelRequest,
  res: VercelResponse,
  options: { windowMs: number; maxRequests: number } = { windowMs: 15 * 60 * 1000, maxRequests: 100 }
): boolean {
  const clientIp = req.headers['x-forwarded-for'] as string || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const windowStart = now - options.windowMs;

  // Clean up old entries
  for (const [ip, data] of rateLimitMap.entries()) {
    if (data.resetTime < now) {
      rateLimitMap.delete(ip);
    }
  }

  const clientData = rateLimitMap.get(clientIp);
  
  if (!clientData || clientData.resetTime < now) {
    // First request or window expired
    rateLimitMap.set(clientIp, {
      count: 1,
      resetTime: now + options.windowMs
    });
    return true;
  }

  if (clientData.count >= options.maxRequests) {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
    });
    return false;
  }

  clientData.count++;
  return true;
}

/**
 * Input sanitization helpers
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

export function validateEmail(email: string): boolean {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EMAIL_REGEX.test(email);
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}