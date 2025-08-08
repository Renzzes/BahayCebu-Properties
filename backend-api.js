const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['https://bahaycebu-properties.com', 'https://api.bahaycebu-properties.com', 'http://localhost:8081'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

// Database connection
const createConnection = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bahaycebu_db',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Google authentication endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    console.log('Google auth request:', req.body);
    const { email, name, picture, googleId } = req.body;

    if (!email || !name || !googleId) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, name, and googleId are required'
      });
    }

    const connection = await createConnection();
    
    try {
      // Check if user exists
      const [users] = await connection.execute(
        'SELECT * FROM User WHERE email = ?',
        [email]
      );

      let user;
      if (users.length === 0) {
        // Create new user
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        
        const [result] = await connection.execute(
          'INSERT INTO User (email, name, password, profilePicture, googleId, role, createdAt, lastLogin) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [email, name, hashedPassword, picture, googleId, 'USER']
        );
        
        user = {
          id: result.insertId,
          email,
          name,
          role: 'USER',
          profilePicture: picture
        };
        
        console.log('Created new user:', user);
      } else {
        // Update existing user
        await connection.execute(
          'UPDATE User SET googleId = ?, profilePicture = ?, lastLogin = NOW() WHERE email = ?',
          [googleId, picture, email]
        );
        
        user = {
          id: users[0].id,
          email: users[0].email,
          name: users[0].name,
          role: users[0].role,
          profilePicture: picture
        };
        
        console.log('Updated existing user:', user);
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      await connection.end();

      return res.json({
        token,
        user
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      await connection.end();
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to process authentication'
      });
    }

  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to authenticate'
    });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email and password are required'
      });
    }

    const connection = await createConnection();
    
    try {
      const [users] = await connection.execute(
        'SELECT * FROM User WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        await connection.end();
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Invalid email or password'
        });
      }

      const user = users[0];
      
      // Check if user has a password (might be null for OAuth users)
      if (!user.password) {
        console.log('User has no password (OAuth user):', email);
        await connection.end();
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Invalid email or password'
        });
      }
      
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        await connection.end();
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Invalid email or password'
        });
      }

      // Update last login
      await connection.execute(
        'UPDATE User SET lastLogin = NOW() WHERE id = ?',
        [user.id]
      );

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      await connection.end();

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          profilePicture: user.profilePicture
        }
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      await connection.end();
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to process login'
      });
    }

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process login'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;