import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Create Prisma client with explicit database URL
const dbHost = process.env.DB_HOST || '153.92.15.81';
const dbUser = process.env.DB_USER || 'u547531148_bahaycebu_admi';
const dbPassword = process.env.DB_PASSWORD || 'Bahaycebu123';
const dbName = process.env.DB_NAME || 'u547531148_bahaycebu_db';

// Construct database URL from individual components
const dbUrl = process.env.DATABASE_URL || 
  `mysql://${dbUser}:${dbPassword}@${dbHost}:3306/${dbName}`;

console.log('Database components:', { dbHost, dbUser, dbName });

export const prisma = global.prisma || new PrismaClient({
  datasources: {
    db: {
      url: dbUrl
    }
  }
});

// Log database connection information
console.log('Prisma Client initialized with DATABASE_URL:', dbUrl);

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}