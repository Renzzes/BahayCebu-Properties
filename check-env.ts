// Check environment variables
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Check if DATABASE_URL is properly formatted
if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log('Database protocol:', url.protocol);
    console.log('Database host:', url.hostname);
    console.log('Database port:', url.port);
    console.log('Database path (database name):', url.pathname.substring(1));
    console.log('Database username:', url.username);
    console.log('Database password:', url.password ? '***' : 'not set');
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error);
  }
} else {
  console.error('DATABASE_URL is not defined');
}