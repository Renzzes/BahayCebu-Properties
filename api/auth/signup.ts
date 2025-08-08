import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_db';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Log the database connection details being used
  console.log('Database connection config:', {
    host: process.env.DB_HOST ? 'Using process.env.DB_HOST' : 'Using fallback host',
    user: process.env.DB_USER ? 'Using process.env.DB_USER' : 'Using fallback user',
    dbName: process.env.DB_NAME ? 'Using process.env.DB_NAME' : 'Using fallback dbName',
    isProduction: process.env.NODE_ENV === 'production',
  });

  console.log('Received signup request:', {
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
    console.log('Processing signup for:', { email, name });

    // Validate input
    if (!email || !password || !name) {
      console.log('Missing required fields:', { email: !!email, password: !!password, name: !!name });
      return res.status(400).json({ 
        error: "Missing required fields",
        details: {
          email: !email ? "Email is required" : null,
          password: !password ? "Password is required" : null,
          name: !name ? "Name is required" : null
        }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword, 
        name 
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

    console.log('User created successfully:', { id: user.id, email: user.email });

    return res.status(201).json({ 
      id: user.id, 
      email: user.email, 
      name: user.name 
    });

  } catch (err: unknown) {
    console.error('=== Signup Error ===');
    console.error('Error details:', err);
    console.error('Email attempted:', req.body?.email);
    
    if (err instanceof Error) {
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
    }

    // Check for Prisma-specific errors
    if (typeof err === 'object' && err !== null && 'code' in err) {
      const prismaErr = err as { code: string, meta?: any };
      console.error('Prisma error code:', prismaErr.code);
      console.error('Prisma error meta:', prismaErr.meta);
      
      if (prismaErr.code === "P2002") {
        return res.status(400).json({ 
          error: "Validation Error",
          message: "Email already exists",
          code: "P2002"
        });
      }
    }

    return res.status(500).json({ 
      error: "Server Error", 
      message: "Signup failed",
      details: err instanceof Error ? err.message : "Unknown error occurred" 
    });
  }
}