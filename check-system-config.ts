import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSystemConfig() {
  try {
    // Test the connection
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');

    // Check if SystemConfig exists
    const config = await prisma.systemConfig.findUnique({
      where: { id: 'singleton' }
    });
    
    console.log('SystemConfig:', config);
    
    if (config) {
      console.log('Registration enabled:', config.registrationEnabled);
    } else {
      console.log('SystemConfig not found, creating it...');
      const newConfig = await prisma.systemConfig.create({
        data: {
          id: 'singleton',
          registrationEnabled: true
        }
      });
      console.log('Created SystemConfig:', newConfig);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSystemConfig();