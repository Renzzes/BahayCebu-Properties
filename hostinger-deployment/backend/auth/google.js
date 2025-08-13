import { prisma } from '../_db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  // Only log in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Received Google auth request:', {
      method: req.method,
      hasBody: !!req.body,
      hasGoogleId: !!req.body?.googleId
    });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://bahaycebu-properties.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { googleId, email, name, picture } = req.body;
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Processing Google auth for:', { googleId, email, name });
    }

    // Validate input
    const validationErrors = [];
    
    if (!googleId) {
      validationErrors.push('Google ID is required');
    } else if (typeof googleId !== 'string' || googleId.trim().length === 0) {
      validationErrors.push('Invalid Google ID format');
    }
    
    if (!email) {
      validationErrors.push('Email is required');
    } else if (!EMAIL_REGEX.test(email)) {
      validationErrors.push('Please provide a valid email address');
    }
    
    if (!name) {
      validationErrors.push('Name is required');
    } else if (name.trim().length < 2) {
      validationErrors.push('Name must be at least 2 characters long');
    }
    
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        error: "Validation failed",
        message: validationErrors.join(', '),
        details: validationErrors
      });
    }
    
    // Sanitize inputs
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedName = name.trim();
    const sanitizedGoogleId = googleId.trim();

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!user) {
      // Check if any users exist
      const userCount = await prisma.user.count();
      
      // If users exist, check if registration is enabled
      if (userCount > 0) {
        const config = await prisma.systemConfig.findUnique({
          where: { id: 'singleton' }
        });

        if (!config?.registrationEnabled) {
          console.log('Registration is disabled');
          return res.status(403).json({ error: "New registrations are currently disabled" });
        }
      }

      // Create new user if doesn't exist
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await prisma.user.create({
        data: {
          email: sanitizedEmail,
          name: sanitizedName,
          password: hashedPassword,
          profilePicture: picture,
          googleId: sanitizedGoogleId,
        },
      });

      // If this is the first user, disable registration
      if (userCount === 0) {
        await prisma.systemConfig.upsert({
          where: { id: 'singleton' },
          update: { registrationEnabled: false },
          create: {
            id: 'singleton',
            registrationEnabled: false
          }
        });
        console.log('First user registered - disabled further registrations');
      }
    } else {
      // Update existing user's Google info
      user = await prisma.user.update({
        where: { email: sanitizedEmail },
        data: {
          googleId: sanitizedGoogleId,
          profilePicture: picture || user.profilePicture,
        },
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('User processed:', { id: user.id, email: user.email, name: user.name });
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
      console.log('Google auth successful for user:', { id: user.id, email: user.email });
    }

    return res.status(200).json({
      message: "Google authentication successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profilePicture: user.profilePicture,
        lastLogin: new Date().toISOString()
      }
    });
  } catch (error) {
    // Log errors appropriately
    if (process.env.NODE_ENV !== 'production') {
      console.error('Google auth error:', error);
    } else {
      console.error('Google auth error occurred:', error.message);
    }
    
    // Check if it's a database connection error
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      return res.status(503).json({ 
        error: "Service temporarily unavailable",
        message: "Database connection failed. Please try again later."
      });
    }
    
    // Check for authentication errors
    if (error.message && error.message.includes('Authentication failed')) {
      return res.status(500).json({ 
        error: "Server Error",
        message: "Database connection failed",
        details: error.message
      });
    }
    
    // Check for validation errors from Prisma
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: "Conflict",
        message: "A user with this email already exists"
      });
    }
    
    // Generic server error
    return res.status(500).json({ 
      error: "Internal server error",
      message: "An unexpected error occurred during Google authentication"
    });
  }
}