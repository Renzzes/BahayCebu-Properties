// Load environment variables from appropriate file based on environment
const fs = require('fs');
const envFile = fs.existsSync('./.env.api.local') ? './.env.api.local' : './.env.api';
require('dotenv').config({ path: envFile });
console.log(`Loading environment from: ${envFile}`);

// Import and run the API server
require('./backend-api.js');

console.log(`API server started on port ${process.env.PORT || 3001}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Database host: ${process.env.DB_HOST}`);
console.log(`Database user: ${process.env.DB_USER}`);
console.log(`Database name: ${process.env.DB_NAME}`);