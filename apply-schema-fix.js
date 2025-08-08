require('dotenv').config({ path: '.env.api' });
const mysql = require('mysql2/promise');

async function applySchemaFix() {
  console.log('🔧 Applying database schema fix...');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '153.92.15.81',
    user: process.env.DB_USER || 'u547531148_bahaycebu_admi',
    password: process.env.DB_PASSWORD || 'Bahaycebu123',
    database: process.env.DB_NAME || 'u547531148_bahaycebu_db'
  });

  try {
    console.log('\n📋 Current User table structure:');
    const [beforeColumns] = await connection.execute('DESCRIBE User');
    beforeColumns.forEach(column => {
      console.log(`  - ${column.Field}: ${column.Type}`);
    });

    // Check if role column already exists
    const hasRoleColumn = beforeColumns.some(column => column.Field === 'role');
    
    if (hasRoleColumn) {
      console.log('\n✅ Role column already exists!');
      return;
    }

    console.log('\n🔧 Adding role column...');
    await connection.execute("ALTER TABLE User ADD COLUMN role VARCHAR(50) DEFAULT 'USER'");
    console.log('✅ Role column added successfully');

    console.log('\n🔧 Updating existing users...');
    await connection.execute("UPDATE User SET role = 'USER' WHERE role IS NULL OR role = ''");
    console.log('✅ Existing users updated');

    console.log('\n🔧 Adding index on role column...');
    try {
      await connection.execute('CREATE INDEX idx_user_role ON User(role)');
      console.log('✅ Index created successfully');
    } catch (indexError) {
      if (indexError.message.includes('Duplicate key name')) {
        console.log('ℹ️ Index already exists');
      } else {
        console.log('⚠️ Index creation failed:', indexError.message);
      }
    }

    console.log('\n📋 Updated User table structure:');
    const [afterColumns] = await connection.execute('DESCRIBE User');
    afterColumns.forEach(column => {
      console.log(`  - ${column.Field}: ${column.Type} ${column.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${column.Default ? `DEFAULT ${column.Default}` : ''}`);
    });

    console.log('\n✅ Schema fix applied successfully!');

  } catch (error) {
    console.error('❌ Error applying schema fix:', error.message);
  } finally {
    await connection.end();
  }
}

applySchemaFix().catch(console.error);