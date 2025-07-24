import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    name: string;
  }
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || '') as {
      userId: string;
      email: string;
      name: string;
    };
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token." });
  }
};

export const generateToken = (payload: { userId: string; email: string; name: string }) => {
  return jwt.sign(payload, process.env.JWT_SECRET || '', { expiresIn: '24h' });
}; 