import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
if (!global.prisma) {
  global.prisma = undefined;
}

// Create Prisma client with explicit database URL
const dbHost = process.env.DB_HOST || '153.92.15.81';
const dbUser = process.env.DB_USER || 'u547531148_bahaycebu_admi';
const dbPassword = process.env.DB_PASSWORD || 'Bahaycebu123';
const dbName = process.env.DB_NAME || 'u547531148_bahaycebu_db';

// Construct database URL from individual components
const dbUrl = process.env.DATABASE_URL || 
  `mysql://${dbUser}:${dbPassword}@${dbHost}:3306/${dbName}`;

// Only log non-sensitive connection info in development
if (process.env.NODE_ENV !== 'production') {
  console.log('Database components:', { 
    dbHost, 
    dbUser, 
    dbName,
    hasPassword: !!dbPassword,
    connectionSource: process.env.DATABASE_URL ? 'env' : 'constructed'
  });
}

const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 
           "mysql://u547531148_bahaycebu_admi:Bahaycebu123@153.92.15.81:3306/u547531148_bahaycebu_db"
    }
  },
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error']
});

// Only log in development
if (process.env.NODE_ENV !== 'production') {
  console.log('Prisma Client initialized successfully');
}

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma };