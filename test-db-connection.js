// Load environment variables from .env.api file
require('dotenv').config({ path: './.env.api' });
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('Testing database connection with the following parameters:');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`User: ${process.env.DB_USER}`);
  console.log(`Database: ${process.env.DB_NAME}`);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    console.log('Connection successful!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('Query result:', rows);
    
    // Close the connection
    await connection.end();
    console.log('Connection closed.');
    
    return true;
  } catch (error) {
    console.error('Connection failed:', error);
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    if (success) {
      console.log('Database connection test completed successfully.');
    } else {
      console.log('Database connection test failed.');
    }
  })
  .catch(err => {
    console.error('Unexpected error:', err);
  });