require('dotenv').config({ path: '.env.api' });
const mysql = require('mysql2/promise');

async function addLastLoginColumn() {
  console.log('🔧 Adding lastLogin column to User table...');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '153.92.15.81',
    user: process.env.DB_USER || 'u547531148_bahaycebu_admi',
    password: process.env.DB_PASSWORD || 'Bahaycebu123',
    database: process.env.DB_NAME || 'u547531148_bahaycebu_db'
  });

  try {
    // Check if lastLogin column already exists
    const [columns] = await connection.execute('DESCRIBE User');
    const hasLastLoginColumn = columns.some(column => column.Field === 'lastLogin');
    
    if (hasLastLoginColumn) {
      console.log('✅ lastLogin column already exists!');
      return;
    }

    console.log('🔧 Adding lastLogin column...');
    await connection.execute('ALTER TABLE User ADD COLUMN lastLogin DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3)');
    console.log('✅ lastLogin column added successfully');

    console.log('\n📋 Updated User table structure:');
    const [updatedColumns] = await connection.execute('DESCRIBE User');
    updatedColumns.forEach(column => {
      console.log(`  - ${column.Field}: ${column.Type} ${column.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${column.Default ? `DEFAULT ${column.Default}` : ''}`);
    });

    console.log('\n✅ Schema update completed successfully!');

  } catch (error) {
    console.error('❌ Error adding lastLogin column:', error.message);
  } finally {
    await connection.end();
  }
}

addLastLoginColumn().catch(console.error);