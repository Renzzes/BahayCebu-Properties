import { prisma } from '../_db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://bahaycebu-properties.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Test database connection first
    try {
      await prisma.$connect();
      if (process.env.NODE_ENV !== 'production') {
        console.log('Database connection successful in login handler');
      }
    } catch (dbError) {
      console.error('Database connection error in login handler:', dbError);
      return res.status(500).json({ 
        error: "Server Error", 
        message: "Database connection failed",
        details: dbError instanceof Error ? dbError.message : "Unknown database error"
      });
    }

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Missing credentials',
        message: 'Email and password are required' 
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Invalid email or password' 
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Authentication service is not properly configured' 
      });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name 
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    if (process.env.NODE_ENV !== 'production') {
      console.log('Login successful for user:', user.email);
    }

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
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
    
    // Check for Prisma errors
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