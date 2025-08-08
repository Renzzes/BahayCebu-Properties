// API endpoint to test database connection
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from './_db';
import Cors from 'cors';

// Initialize CORS middleware
const cors = Cors({
  methods: ['GET', 'OPTIONS'],
  origin: '*',
});

// Helper method to run middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Run the CORS middleware
  await runMiddleware(req, res, cors);

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log environment variables (without sensitive info)
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_NAME: process.env.DB_NAME,
      hasDbPassword: !!process.env.DB_PASSWORD,
      hasJwtSecret: !!process.env.JWT_SECRET,
    };

    // Test database connection
    await prisma.$connect();

    // Check tables
    const userCount = await prisma.user.count();
    
    // Check SystemConfig
    const systemConfig = await prisma.systemConfig.findUnique({
      where: { id: 'singleton' }
    });

    // Create SystemConfig if it doesn't exist
    let configResult = systemConfig;
    if (!systemConfig) {
      configResult = await prisma.systemConfig.create({
        data: {
          id: 'singleton',
          registrationEnabled: true
        }
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      environment: envInfo,
      data: {
        userCount,
        systemConfig: configResult
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}