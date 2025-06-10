import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_db';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    console.log('User created successfully:', { id: user.id, email: user.email });

    return res.status(201).json({ 
      id: user.id, 
      email: user.email, 
      name: user.name 
    });

  } catch (err: unknown) {
    console.error('Signup error:', err);

    if (typeof err === 'object' && err !== null && 'code' in err) {
      if (err.code === "P2002") {
        return res.status(400).json({ error: "Email already exists" });
      }
    }

    return res.status(500).json({ 
      error: "Signup failed", 
      details: err instanceof Error ? err.message : "Unknown error occurred" 
    });
  }
} 