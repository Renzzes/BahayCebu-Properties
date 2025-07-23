import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // Test the connection
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');

    // Try to query the User table
    const userCount = await prisma.user.count();
    console.log('✅ Successfully queried User table. Total users:', userCount);

    // Try to query the Property table
    const propertyCount = await prisma.property.count();
    console.log('✅ Successfully queried Property table. Total properties:', propertyCount);

    // Try to query the Agent table
    const agentCount = await prisma.agent.count();
    console.log('✅ Successfully queried Agent table. Total agents:', agentCount);

  } catch (error) {
    console.error('❌ Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection(); 