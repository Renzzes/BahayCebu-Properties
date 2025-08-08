// Load environment variables from .env.api file
require('dotenv').config({ path: './.env.api' });

// Import and run the API server
require('./backend-api.js');

console.log(`API server started on port ${process.env.PORT || 3001}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Database host: ${process.env.DB_HOST}`);
console.log(`Database user: ${process.env.DB_USER}`);
console.log(`Database name: ${process.env.DB_NAME}`);