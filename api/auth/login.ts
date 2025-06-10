import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_db';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Received login request:', {
    method: req.method,
    headers: req.headers,
    body: req.body
  });

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
    console.log('Request body:', { email, password: '***' });

    // Validate input
    if (!email || !password) {
      console.log('Missing required fields:', { email: !!email, password: !!password });
      return res.status(400).json({ 
        error: "Missing required fields",
        details: {
          email: !email ? "Email is required" : null,
          password: !password ? "Password is required" : null
        }
      });
    }

    console.log('Looking up user:', email);
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log('Verifying password for user:', email);
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log('Login successful for user:', email);
    return res.status(200).json({ 
      id: user.id, 
      email: user.email, 
      name: user.name 
    });
  } catch (err) {
    console.error("Login error:", err);
    // Ensure we're always sending a valid JSON response
    return res.status(500).json({ 
      error: "Login failed", 
      details: err instanceof Error ? err.message : "Unknown error occurred",
      stack: process.env.NODE_ENV === 'development' ? (err instanceof Error ? err.stack : undefined) : undefined
    });
  } finally {
    // Always disconnect from the database
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
  }
} 