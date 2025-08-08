import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_db';
import bcrypt from 'bcryptjs';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation regex (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only log in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Received signup request:', {
      method: req.method,
      hasBody: !!req.body,
      email: req.body?.email || 'not provided'
    });
  }

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

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
    // Test database connection first
    try {
      await prisma.$connect();
      console.log('Database connection successful in signup handler');
    } catch (dbError) {
      console.error('Database connection error in signup handler:', dbError);
      return res.status(500).json({ 
        error: "Server Error", 
        message: "Database connection failed",
        details: dbError instanceof Error ? dbError.message : "Unknown database error"
      });
    }

    // Check if any users exist
    console.log('Checking user count...');
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    
    // If users exist, check if registration is enabled
    if (userCount > 0) {
      console.log('Checking if registration is enabled...');
      const config = await prisma.systemConfig.findUnique({
        where: { id: 'singleton' }
      });
      console.log('SystemConfig:', config);

      if (!config?.registrationEnabled) {
        console.log('Registration is disabled');
        return res.status(403).json({ error: "New registrations are currently disabled" });
      }
    }

    const { email, password, name } = req.body;
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Processing signup for:', { email, name });
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
    } else if (!PASSWORD_REGEX.test(password)) {
      validationErrors.push('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
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

    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds for better security
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('Password hashed successfully');
    }

    const user = await prisma.user.create({
      data: { 
        email: sanitizedEmail, 
        password: hashedPassword, 
        name: sanitizedName 
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

    if (process.env.NODE_ENV !== 'production') {
      console.log('User created successfully:', { id: user.id, email: user.email });
    }

    return res.status(201).json({ 
      id: user.id, 
      email: user.email, 
      name: user.name 
    });

  } catch (error: any) {
    // Log errors appropriately
    if (process.env.NODE_ENV !== 'production') {
      console.error('Signup error:', error);
    } else {
      console.error('Signup error occurred:', error.message);
    }
    
    // Check if it's a database connection error
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      return res.status(503).json({ 
        error: "Service temporarily unavailable",
        message: "Unable to connect to the database. Please try again later."
      });
    }
    
    // Check if it's a duplicate email error
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      return res.status(409).json({ 
        error: "Email already exists",
        message: "An account with this email address already exists. Please use a different email or try logging in."
      });
    }
    
    // Check for other Prisma errors
    if (error.code?.startsWith('P')) {
      return res.status(400).json({ 
        error: "Database error",
        message: "There was an issue processing your request. Please try again."
      });
    }
    
    return res.status(500).json({ 
      error: "Internal server error",
      message: "An unexpected error occurred. Please try again later."
    });
  }
}