import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_db';
import { verifyToken } from '../utils/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verify admin authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization required' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    // Here you might want to add additional checks to ensure the user is an admin
    // For example, checking a role field or specific email addresses

    if (req.method === 'GET') {
      const config = await prisma.systemConfig.findUnique({
        where: { id: 'singleton' }
      });
      
      return res.status(200).json(config);
    }

    if (req.method === 'PUT') {
      const { registrationEnabled } = req.body;

      if (typeof registrationEnabled !== 'boolean') {
        return res.status(400).json({ error: 'Invalid registration status' });
      }

      const config = await prisma.systemConfig.upsert({
        where: { id: 'singleton' },
        update: { registrationEnabled },
        create: {
          id: 'singleton',
          registrationEnabled
        }
      });

      return res.status(200).json(config);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Auth config error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 