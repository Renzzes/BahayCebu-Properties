require('dotenv').config({ path: '.env.api' });
const mysql = require('mysql2/promise');

async function checkMissingColumns() {
  console.log('🔍 Checking for missing columns in User table...');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '153.92.15.81',
    user: process.env.DB_USER || 'u547531148_bahaycebu_admi',
    password: process.env.DB_PASSWORD || 'Bahaycebu123',
    database: process.env.DB_NAME || 'u547531148_bahaycebu_db'
  });

  try {
    // Get current table structure
    const [currentColumns] = await connection.execute('DESCRIBE User');
    const currentColumnNames = currentColumns.map(col => col.Field);
    
    console.log('\n📋 Current columns in User table:');
    currentColumnNames.forEach(name => console.log(`  - ${name}`));

    // Expected columns based on Prisma schema
    const expectedColumns = [
      'id',
      'email', 
      'name',
      'password',
      'profilePicture',
      'googleId',
      'role',
      'lastLogin',  // This might be missing
      'createdAt',
      'otp',
      'otpExpiry'
    ];

    console.log('\n📋 Expected columns from Prisma schema:');
    expectedColumns.forEach(name => console.log(`  - ${name}`));

    // Find missing columns
    const missingColumns = expectedColumns.filter(col => !currentColumnNames.includes(col));
    
    console.log('\n❌ Missing columns:');
    if (missingColumns.length === 0) {
      console.log('  ✅ No missing columns!');
    } else {
      missingColumns.forEach(col => console.log(`  - ${col}`));
    }

    // Find extra columns
    const extraColumns = currentColumnNames.filter(col => !expectedColumns.includes(col));
    console.log('\n➕ Extra columns (not in Prisma schema):');
    if (extraColumns.length === 0) {
      console.log('  ✅ No extra columns!');
    } else {
      extraColumns.forEach(col => console.log(`  - ${col}`));
    }

    // If there are missing columns, suggest fixes
    if (missingColumns.length > 0) {
      console.log('\n🔧 Suggested fixes:');
      missingColumns.forEach(col => {
        switch(col) {
          case 'lastLogin':
            console.log(`  ALTER TABLE User ADD COLUMN lastLogin DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3);`);
            break;
          default:
            console.log(`  ALTER TABLE User ADD COLUMN ${col} VARCHAR(191);`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Error checking columns:', error.message);
  } finally {
    await connection.end();
  }
}

checkMissingColumns().catch(console.error);