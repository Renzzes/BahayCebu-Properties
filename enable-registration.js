require('dotenv').config({ path: '.env.api' });
const mysql = require('mysql2/promise');

async function enableRegistration() {
  console.log('🔧 Enabling user registration...');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '153.92.15.81',
    user: process.env.DB_USER || 'u547531148_bahaycebu_admi',
    password: process.env.DB_PASSWORD || 'Bahaycebu123',
    database: process.env.DB_NAME || 'u547531148_bahaycebu_db'
  });

  try {
    // Check if SystemConfig table exists
    console.log('🔍 Checking SystemConfig table...');
    const [tables] = await connection.execute("SHOW TABLES LIKE 'SystemConfig'");
    
    if (tables.length === 0) {
      console.log('📋 Creating SystemConfig table...');
      await connection.execute(`
        CREATE TABLE SystemConfig (
          id VARCHAR(191) NOT NULL PRIMARY KEY DEFAULT 'singleton',
          registrationEnabled BOOLEAN NOT NULL DEFAULT TRUE,
          updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
        )
      `);
      console.log('✅ SystemConfig table created');
    }

    // Check current registration status
    console.log('🔍 Checking current registration status...');
    const [configs] = await connection.execute('SELECT * FROM SystemConfig WHERE id = "singleton"');
    
    if (configs.length === 0) {
      console.log('📋 Creating initial SystemConfig record...');
      await connection.execute(
        'INSERT INTO SystemConfig (id, registrationEnabled, updatedAt) VALUES ("singleton", TRUE, NOW(3))'
      );
      console.log('✅ Registration enabled (new record created)');
    } else {
      const currentStatus = configs[0].registrationEnabled;
      console.log(`Current registration status: ${currentStatus ? 'ENABLED' : 'DISABLED'}`);
      
      if (!currentStatus) {
        console.log('🔧 Enabling registration...');
        await connection.execute(
          'UPDATE SystemConfig SET registrationEnabled = TRUE, updatedAt = NOW(3) WHERE id = "singleton"'
        );
        console.log('✅ Registration enabled');
      } else {
        console.log('✅ Registration is already enabled');
      }
    }

    // Verify the change
    const [finalConfigs] = await connection.execute('SELECT * FROM SystemConfig WHERE id = "singleton"');
    console.log('\n📋 Final SystemConfig:');
    console.log(`  Registration Enabled: ${finalConfigs[0].registrationEnabled}`);
    console.log(`  Last Updated: ${finalConfigs[0].updatedAt}`);

  } catch (error) {
    console.error('❌ Error enabling registration:', error.message);
  } finally {
    await connection.end();
  }
}

enableRegistration().catch(console.error);