require('dotenv').config({ path: '.env.api' });
const mysql = require('mysql2/promise');

async function checkUserTableStructure() {
  console.log('🔍 Checking User table structure...');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '153.92.15.81',
    user: process.env.DB_USER || 'u547531148_bahaycebu_admi',
    password: process.env.DB_PASSWORD || 'Bahaycebu123',
    database: process.env.DB_NAME || 'u547531148_bahaycebu_db'
  });

  try {
    // Check table structure
    console.log('\n📋 User table structure:');
    const [structure] = await connection.execute('DESCRIBE User');
    console.table(structure);
    
    // Check if there are any users
    console.log('\n👥 Current users in database:');
    const [users] = await connection.execute('SELECT id, email, name, createdAt FROM User ORDER BY createdAt DESC LIMIT 5');
    console.table(users);
    
    // Check the id field type specifically
    console.log('\n🔍 ID field details:');
    const [idInfo] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'User' AND COLUMN_NAME = 'id'
    `, [process.env.DB_NAME || 'u547531148_bahaycebu_db']);
    console.table(idInfo);
    
  } catch (error) {
    console.error('❌ Error checking User table:', error);
  } finally {
    await connection.end();
  }
}

checkUserTableStructure().catch(console.error);