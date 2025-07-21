import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('\n🔍 Checking Supabase Configuration:\n');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Present (first 10 chars: ' + supabaseKey.substring(0, 10) + '...)' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  try {
    // Test basic connection
    const { error: authError } = await supabase.auth.getSession();
    if (authError) {
      throw authError;
    }
    console.log('\n✅ Supabase connection successful!');

  } catch (error) {
    console.error('\n❌ Supabase connection failed:', error);
  }
}

testSupabase(); 