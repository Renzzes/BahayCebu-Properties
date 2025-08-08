import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only log in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Received login request:', {
      method: req.method,
      hasBody: !!req.body,
      email: req.body?.email || 'not provided'
    });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Test database connection
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return res.status(500).json({ 
        error: "Database connection failed",
        details: dbError instanceof Error ? dbError.message : "Unknown database error"
      });
    }

    const { email, password } = req.body;
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Processing login for:', { email });
    }

    // Validate input
    const validationErrors: string[] = [];
    
    if (!email) {
      validationErrors.push('Email is required');
    } else if (!EMAIL_REGEX.test(email)) {
      validationErrors.push('Please provide a valid email address');
    }
    
    if (!password) {
      validationErrors.push('Password is required');
    }
    
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: "Validation failed",
        message: validationErrors.join(', '),
        details: validationErrors
      });
    }
    
    // Sanitize email
    const sanitizedEmail = email.toLowerCase().trim();

    if (process.env.NODE_ENV !== 'production') {
      console.log('Looking up user:', sanitizedEmail);
    }
    
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('User not found:', sanitizedEmail);
      }
      // Use generic error message to prevent email enumeration
      return res.status(401).json({ 
        error: "Invalid credentials",
        message: "The email or password you entered is incorrect."
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('User found:', { id: user.id, email: user.email, hasPassword: !!user.password });
    }

    // Check if this is a Google OAuth user
    if (user.googleId) {
      console.log('Google OAuth user attempting password login:', sanitizedEmail);
      return res.status(400).json({ 
        error: "Please use Google Sign-In for this account" 
      });
    }

    // Check if user has a password (not a Google-only user)
    if (!user.password) {
      return res.status(400).json({ 
        error: "Google account",
        message: "This account was created with Google. Please use Google Sign-In to access your account."
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('Verifying password for user:', user.id);
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Password verification result:', isPasswordValid);
    }

    if (!isPasswordValid) {
      // Use generic error message to prevent timing attacks
      return res.status(401).json({ 
        error: "Invalid credentials",
        message: "The email or password you entered is incorrect."
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('Password verified successfully for user:', user.id);
    }

    // Validate JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured');
      return res.status(500).json({ 
        error: "Server configuration error",
        message: "Authentication service is not properly configured."
      });
    }

    // Generate JWT token with more secure payload
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '7d',
        issuer: 'bahaycebu-properties',
        audience: 'bahaycebu-users'
      }
    );

    if (process.env.NODE_ENV !== 'production') {
      console.log('JWT token generated for user:', user.id);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('Login successful for user:', { id: user.id, email: user.email });
    }

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastLogin: new Date().toISOString()
      }
    });

  } catch (error: any) {
    // Log errors appropriately
    if (process.env.NODE_ENV !== 'production') {
      console.error('Login error:', error);
    } else {
      console.error('Login error occurred:', error.message);
    }
    
    // Check if it's a database connection error
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      return res.status(503).json({ 
        error: "Service temporarily unavailable",
        message: "Unable to connect to the database. Please try again later."
      });
    }
    
    // Check for JWT errors
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(500).json({ 
        error: "Authentication service error",
        message: "There was an issue with the authentication service. Please try again."
      });
    }
    
    // Check for other Prisma errors
    if (error.code?.startsWith('P')) {
      return res.status(500).json({ 
        error: "Database error",
        message: "There was an issue processing your request. Please try again."
      });
    }
    
    return res.status(500).json({ 
      error: "Internal server error",
      message: "An unexpected error occurred. Please try again later."
    });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
  }
}