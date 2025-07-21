import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testConnections() {
  console.log('\n🔍 Testing Connections\n');

  // 1. Test Database Connection
  console.log('Testing PostgreSQL Connection...');
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    const propertyCount = await prisma.property.count();
    console.log(`📊 Database Stats:
    - Users: ${userCount}
    - Properties: ${propertyCount}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }

  // 2. Test Supabase Connection
  console.log('\nTesting Supabase Connection...');
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  try {
    const { error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    console.log('✅ Supabase connection successful!');

    // Test Storage Buckets
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      throw bucketsError;
    }

    console.log('\n📦 Storage Buckets:');
    buckets.forEach(bucket => {
      console.log(`- ${bucket.name}`);
    });
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
  }
}

testConnections(); 