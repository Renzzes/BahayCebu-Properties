require('dotenv').config({ path: '.env.api' });
const mysql = require('mysql2/promise');

async function testUserTable() {
  console.log('🔍 Testing User table structure...');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '153.92.15.81',
    user: process.env.DB_USER || 'u547531148_bahaycebu_admi',
    password: process.env.DB_PASSWORD || 'Bahaycebu123',
    database: process.env.DB_NAME || 'u547531148_bahaycebu_db'
  });

  try {
    // Check if User table exists and get its structure
    console.log('\n📋 Checking User table structure...');
    const [tableInfo] = await connection.execute('DESCRIBE User');
    console.log('User table columns:');
    tableInfo.forEach(column => {
      console.log(`  - ${column.Field}: ${column.Type} ${column.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${column.Default ? `DEFAULT ${column.Default}` : ''}`);
    });

    // Check if role column exists
    const hasRoleColumn = tableInfo.some(column => column.Field === 'role');
    console.log(`\n🔍 Role column exists: ${hasRoleColumn ? '✅ Yes' : '❌ No'}`);

    // Try to count existing users
    console.log('\n👥 Checking existing users...');
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM User');
    console.log(`Total users in database: ${userCount[0].count}`);

    // If there are users, show a sample
    if (userCount[0].count > 0) {
      const [sampleUsers] = await connection.execute('SELECT id, email, name, createdAt FROM User LIMIT 3');
      console.log('Sample users:');
      sampleUsers.forEach(user => {
        console.log(`  - ${user.email} (${user.name}) - Created: ${user.createdAt}`);
      });
    }

    // Test if we can insert a user (dry run - we'll rollback)
    console.log('\n🧪 Testing user insertion (dry run)...');
    await connection.beginTransaction();
    
    try {
      const testEmail = `test_${Date.now()}@example.com`;
      const [insertResult] = await connection.execute(
        'INSERT INTO User (id, email, name, password, createdAt) VALUES (?, ?, ?, ?, NOW())',
        [`test_${Date.now()}`, testEmail, 'Test User', 'hashedpassword']
      );
      console.log('✅ User insertion test successful (rolling back)');
      await connection.rollback();
    } catch (insertError) {
      console.log('❌ User insertion test failed:', insertError.message);
      await connection.rollback();
    }

  } catch (error) {
    console.error('❌ Error testing User table:', error.message);
  } finally {
    await connection.end();
  }
}

testUserTable().catch(console.error);