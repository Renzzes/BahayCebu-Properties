import { prisma } from '../_db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Google auth API called:', {
    method: req.method,
    headers: req.headers,
    body: req.body
  });

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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, picture, googleId } = req.body;
    console.log('Request body:', { email, name, googleId, picture: picture ? 'present' : 'missing' });

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
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
          email,
          name,
          password: hashedPassword,
          profilePicture: picture,
          googleId,
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
        where: { email },
        data: {
          googleId,
          profilePicture: picture || user.profilePicture,
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
} 