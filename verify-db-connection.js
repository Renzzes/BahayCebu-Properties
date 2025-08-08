// Script to verify database connection
require('dotenv').config({ path: '.env.api' });

const { PrismaClient } = require('@prisma/client');

async function verifyDatabaseConnection() {
  console.log('Verifying database connection...');
  
  // Log environment variables
  console.log('Environment variables:');
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  // Construct database URL
  const dbHost = process.env.DB_HOST || '153.92.15.81';
  const dbUser = process.env.DB_USER || 'u547531148_bahaycebu_admi';
  const dbPassword = process.env.DB_PASSWORD || 'Bahaycebu123';
  const dbName = process.env.DB_NAME || 'u547531148_bahaycebu_db';
  
  const dbUrl = `mysql://${dbUser}:${dbPassword}@${dbHost}:3306/${dbName}`;
  console.log('Database URL:', dbUrl);
  
  // Initialize Prisma client
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl
      }
    }
  });
  
  try {
    // Test connection
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Database connection successful!');
    
    // Check tables
    console.log('\nChecking tables...');
    
    // Check User table
    const userCount = await prisma.user.count();
    console.log(`User table: ${userCount} records`);
    
    // Check SystemConfig table
    const systemConfig = await prisma.systemConfig.findUnique({
      where: { id: 'singleton' }
    });
    console.log('SystemConfig:', systemConfig);
    
    // Create SystemConfig if it doesn't exist
    if (!systemConfig) {
      console.log('Creating SystemConfig...');
      const newConfig = await prisma.systemConfig.create({
        data: {
          id: 'singleton',
          registrationEnabled: true
        }
      });
      console.log('Created SystemConfig:', newConfig);
    }
    
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabaseConnection();