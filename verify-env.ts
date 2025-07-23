import { config } from 'dotenv';

// Load environment variables
config();

declare const process: {
  env: {
    DATABASE_URL?: string;
    NODE_ENV?: string;
    PRODUCTION_URL?: string;
  }
};

const databaseUrl = process.env.DATABASE_URL;
const nodeEnv = process.env.NODE_ENV;
const productionUrl = process.env.PRODUCTION_URL;

console.log('\n🔍 Checking Environment Variables:\n');

// Check required environment variables
console.log('DATABASE_URL:', databaseUrl ? '✅ Present' : '❌ Missing');
console.log('NODE_ENV:', nodeEnv ? '✅ Present' : '❌ Missing');
console.log('PRODUCTION_URL:', productionUrl ? '✅ Present' : '❌ Missing');

// Validate DATABASE_URL format
if (databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    if (url.protocol !== 'postgresql:') {
      console.log('❌ DATABASE_URL must use postgresql protocol');
    } else {
      console.log('✅ DATABASE_URL format is valid');
    }
  } catch (e) {
    console.log('❌ DATABASE_URL is not a valid URL');
  }
}

// Validate NODE_ENV values
if (nodeEnv && !['development', 'production', 'test'].includes(nodeEnv)) {
  console.log('❌ NODE_ENV must be one of: development, production, test');
}

// Validate PRODUCTION_URL format
if (productionUrl) {
  try {
    new URL(productionUrl);
    console.log('✅ PRODUCTION_URL format is valid');
  } catch (e) {
    console.log('❌ PRODUCTION_URL is not a valid URL');
  }
} 