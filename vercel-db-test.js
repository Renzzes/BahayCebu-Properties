// This script tests the database connection in the Vercel environment

const { PrismaClient } = require('@prisma/client');

// Create a Prisma client with explicit DATABASE_URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "mysql://u547531148_bahaycebu_admi:Bahaycebu123@153.92.15.81:3306/u547531148_bahaycebu_db"
    }
  }
});

async function testConnection() {
  console.log('Testing database connection...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  
  try {
    // Test the connection
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');

    // Try to query the User table
    const userCount = await prisma.user.count();
    console.log('✅ Successfully queried User table. Total users:', userCount);

    // Check if SystemConfig exists
    const config = await prisma.systemConfig.findUnique({
      where: { id: 'singleton' }
    });
    
    console.log('SystemConfig:', config);
    
    if (config) {
      console.log('Registration enabled:', config.registrationEnabled);
    } else {
      console.log('SystemConfig not found');
    }

  } catch (error) {
    console.error('❌ Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();