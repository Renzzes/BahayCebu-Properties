import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const databaseUrl = process.env.DATABASE_URL;
const nodeEnv = process.env.NODE_ENV;
const productionUrl = process.env.PRODUCTION_URL;

console.log('\n🔍 Checking Environment Variables:\n');

// Check each variable
console.log('1. Database URL:', databaseUrl ? '✅ Found' : '❌ Missing');
console.log('2. Supabase URL:', supabaseUrl ? '✅ Found' : '❌ Missing');
console.log('3. Supabase Anon Key:', supabaseAnonKey ? '✅ Found' : '❌ Missing');
console.log('4. Node Environment:', nodeEnv ? '✅ Found' : '❌ Missing');
console.log('5. Production URL:', productionUrl ? '✅ Found' : '❌ Missing');

// Test Supabase connection if credentials are present
if (supabaseUrl && supabaseAnonKey) {
  console.log('\n🔌 Testing Supabase Connection...');
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  // Try to get session to test connection
  supabase.auth.getSession().then(({ error }) => {
    if (error) {
      console.log('❌ Connection failed:', error.message);
    } else {
      console.log('✅ Supabase connection successful!');
    }
  });
} 