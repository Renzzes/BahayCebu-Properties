const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const fs = require('fs');

// Load environment variables from appropriate file based on environment
const envFile = fs.existsSync('./.env.api.local') ? './.env.api.local' : './.env.api';
if (fs.existsSync(envFile)) {
  require('dotenv').config({ path: envFile });
  console.log(`Loading environment from: ${envFile}`);
} else {
  console.log('No .env.api file found, using default environment variables');
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['https://bahaycebu-properties.com', 'https://api.bahaycebu-properties.com', 'http://localhost:8081', 'http://localhost:8082'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'cache-control']
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

// Handle preflight requests for all routes
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, cache-control');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
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
        const userId = crypto.randomUUID();
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        
        const [result] = await connection.execute(
          'INSERT INTO User (id, email, name, password, profilePicture, googleId, role, createdAt, lastLogin) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [userId, email, name, hashedPassword, picture, googleId, 'USER']
        );
        
        user = {
          id: userId,
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

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, password, and name are required'
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address'
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Password must be at least 6 characters long'
      });
    }

    const connection = await createConnection();
    
    try {
      // Check if user already exists
      const [existingUsers] = await connection.execute(
        'SELECT * FROM User WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        await connection.end();
        return res.status(409).json({
          error: 'User already exists',
          message: 'An account with this email already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create new user
      const userId = crypto.randomUUID();
      const [result] = await connection.execute(
        'INSERT INTO User (id, email, name, password, role, createdAt, lastLogin) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [userId, email, name, hashedPassword, 'USER']
      );
      
      const user = {
        id: userId,
        email,
        name,
        role: 'USER'
      };
      
      console.log('Created new user via signup:', user);

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

      return res.status(201).json({
        message: 'User created successfully',
        token,
        user
      });

    } catch (dbError) {
      console.error('Database error during signup:', dbError);
      await connection.end();
      
      if (dbError.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          error: 'User already exists',
          message: 'An account with this email already exists'
        });
      }
      
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to create user account'
      });
    }

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process signup'
    });
  }
});

// Properties endpoints
app.get('/api/properties', async (req, res) => {
  try {
    const connection = await createConnection();
    
    try {
      const [properties] = await connection.execute(
        'SELECT * FROM Property ORDER BY createdAt DESC'
      );
      
      await connection.end();
      return res.json(properties);
    } catch (dbError) {
      console.error('Database error:', dbError);
      await connection.end();
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to fetch properties'
      });
    }
  } catch (error) {
    console.error('Properties fetch error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch properties'
    });
  }
});

// Agents endpoints
app.get('/api/agents', async (req, res) => {
  try {
    const connection = await createConnection();
    
    try {
      const [agents] = await connection.execute(
        'SELECT * FROM Agent ORDER BY name ASC'
      );
      
      await connection.end();
      return res.json(agents);
    } catch (dbError) {
      console.error('Database error:', dbError);
      await connection.end();
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to fetch agents'
      });
    }
  } catch (error) {
    console.error('Agents fetch error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch agents'
    });
  }
});

// Create agent endpoint
app.post('/api/agents', async (req, res) => {
  try {
    const { name, title, email, phone, location, description, image, specializations, listings, deals, rating, socialMedia } = req.body;

    // Validate required fields
    if (!name || !title || !email || !phone || !location || !description) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, title, email, phone, location, and description are required'
      });
    }

    const connection = await createConnection();
    
    try {
      // Check if agent with email already exists
      const [existingAgents] = await connection.execute(
        'SELECT * FROM Agent WHERE email = ?',
        [email]
      );

      if (existingAgents.length > 0) {
        await connection.end();
        return res.status(400).json({
          error: 'An agent with this email already exists'
        });
      }

      const agentId = crypto.randomUUID();
      const [result] = await connection.execute(
        'INSERT INTO Agent (id, name, title, email, phone, location, description, image, specializations, listings, deals, rating, socialMedia, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [
          agentId,
          name,
          title,
          email,
          phone,
          location,
          description,
          image || null,
          JSON.stringify(specializations || []),
          listings || 0,
          deals || 0,
          rating || 0,
          JSON.stringify(socialMedia || { facebook: '', instagram: '', linkedin: '' })
        ]
      );
      
      // Fetch the created agent
      const [createdAgent] = await connection.execute(
        'SELECT * FROM Agent WHERE id = ?',
        [agentId]
      );
      
      await connection.end();
      return res.status(201).json(createdAgent[0]);
    } catch (dbError) {
      console.error('Database error:', dbError);
      await connection.end();
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to create agent'
      });
    }
  } catch (error) {
    console.error('Agent creation error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create agent'
    });
  }
});

// Update agent endpoint
app.put('/api/agents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, email, phone, location, description, image, specializations, listings, deals, rating, socialMedia } = req.body;

    // Validate required fields
    if (!name || !title || !email || !phone || !location || !description) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const connection = await createConnection();
    
    try {
      // Check if email is being changed and if it's already in use by another agent
      const [existingAgents] = await connection.execute(
        'SELECT * FROM Agent WHERE email = ? AND id != ?',
        [email, id]
      );

      if (existingAgents.length > 0) {
        await connection.end();
        return res.status(400).json({
          error: 'An agent with this email already exists'
        });
      }

      const [result] = await connection.execute(
        'UPDATE Agent SET name = ?, title = ?, email = ?, phone = ?, location = ?, description = ?, image = ?, specializations = ?, listings = ?, deals = ?, rating = ?, socialMedia = ?, updatedAt = NOW() WHERE id = ?',
        [
          name,
          title,
          email,
          phone,
          location,
          description,
          image || null,
          JSON.stringify(specializations || []),
          listings || 0,
          deals || 0,
          rating || 0,
          JSON.stringify(socialMedia || { facebook: '', instagram: '', linkedin: '' }),
          id
        ]
      );
      
      if (result.affectedRows === 0) {
        await connection.end();
        return res.status(404).json({
          error: 'Agent not found'
        });
      }
      
      // Fetch the updated agent
      const [updatedAgent] = await connection.execute(
        'SELECT * FROM Agent WHERE id = ?',
        [id]
      );
      
      await connection.end();
      return res.json(updatedAgent[0]);
    } catch (dbError) {
      console.error('Database error:', dbError);
      await connection.end();
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to update agent'
      });
    }
  } catch (error) {
    console.error('Agent update error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update agent'
    });
  }
});

// Delete agent endpoint
app.delete('/api/agents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await createConnection();
    
    try {
      // Check if agent exists
      const [existingAgent] = await connection.execute(
        'SELECT * FROM Agent WHERE id = ?',
        [id]
      );

      if (existingAgent.length === 0) {
        await connection.end();
        return res.status(404).json({
          error: 'Agent not found'
        });
      }

      const [result] = await connection.execute(
        'DELETE FROM Agent WHERE id = ?',
        [id]
      );
      
      await connection.end();
      return res.json(existingAgent[0]);
    } catch (dbError) {
      console.error('Database error:', dbError);
      await connection.end();
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to delete agent'
      });
    }
  } catch (error) {
    console.error('Agent deletion error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete agent'
    });
  }
});

// Create property endpoint
app.post('/api/properties', async (req, res) => {
  try {
    const {
      title,
      price,
      location,
      bedrooms,
      bathrooms,
      area,
      type,
      featured,
      description,
      images,
      videoUrl,
      thumbnail,
      unitTypes,
      amenities,
      residentialFeatures,
      provisions,
      buildingFeatures
    } = req.body;

    // Validate required fields
    if (!title || !price || !location || !bedrooms || !bathrooms || !area || !type) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Title, price, location, bedrooms, bathrooms, area, and type are required'
      });
    }

    const connection = await createConnection();
    
    try {
      const propertyId = crypto.randomUUID();
      const [result] = await connection.execute(
         'INSERT INTO Property (id, title, price, location, bedrooms, bathrooms, area, type, featured, description, images, videoUrl, thumbnail, unitTypes, unitTypeDetails, amenities, residentialFeatures, provisions, buildingFeatures, locationAccessibility, featuresAmenities, lifestyleCommunity, additionalInformation, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
         [
           propertyId,
           title,
           parseFloat(price),
           location,
           parseInt(bedrooms),
           parseInt(bathrooms),
           parseFloat(area),
           type,
           featured || false,
           description,
           JSON.stringify(images || []),
           videoUrl || null,
           thumbnail || null,
           JSON.stringify(unitTypes || []),
           JSON.stringify([]),
           JSON.stringify(amenities || []),
           JSON.stringify(residentialFeatures || []),
           JSON.stringify(provisions || []),
           JSON.stringify(buildingFeatures || []),
           JSON.stringify({}),
           JSON.stringify({}),
           JSON.stringify({}),
           JSON.stringify({})
         ]
       );
      
      // Fetch the created property
      const [createdProperty] = await connection.execute(
        'SELECT * FROM Property WHERE id = ?',
        [propertyId]
      );
      
      await connection.end();
      return res.status(201).json(createdProperty[0]);
    } catch (dbError) {
      console.error('Database error:', dbError);
      await connection.end();
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to create property'
      });
    }
  } catch (error) {
    console.error('Property creation error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create property'
    });
  }
});

// Update property endpoint
app.put('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      price,
      location,
      bedrooms,
      bathrooms,
      area,
      type,
      featured,
      description,
      images,
      videoUrl,
      thumbnail,
      unitTypes,
      amenities,
      residentialFeatures,
      provisions,
      buildingFeatures
    } = req.body;

    // Validate required fields
    if (!title || !price || !location || !bedrooms || !bathrooms || !area || !type) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const connection = await createConnection();
    
    try {
      const [result] = await connection.execute(
         'UPDATE Property SET title = ?, price = ?, location = ?, bedrooms = ?, bathrooms = ?, area = ?, type = ?, featured = ?, description = ?, images = ?, videoUrl = ?, thumbnail = ?, unitTypes = ?, unitTypeDetails = ?, amenities = ?, residentialFeatures = ?, provisions = ?, buildingFeatures = ?, locationAccessibility = ?, featuresAmenities = ?, lifestyleCommunity = ?, additionalInformation = ?, updatedAt = NOW() WHERE id = ?',
         [
           title,
           parseFloat(price),
           location,
           parseInt(bedrooms),
           parseInt(bathrooms),
           parseFloat(area),
           type,
           featured || false,
           description,
           JSON.stringify(images || []),
           videoUrl || null,
           thumbnail || null,
           JSON.stringify(unitTypes || []),
           JSON.stringify([]),
           JSON.stringify(amenities || []),
           JSON.stringify(residentialFeatures || []),
           JSON.stringify(provisions || []),
           JSON.stringify(buildingFeatures || []),
           JSON.stringify({}),
           JSON.stringify({}),
           JSON.stringify({}),
           JSON.stringify({}),
           id
         ]
       );
      
      if (result.affectedRows === 0) {
        await connection.end();
        return res.status(404).json({
          error: 'Property not found'
        });
      }
      
      // Fetch the updated property
      const [updatedProperty] = await connection.execute(
        'SELECT * FROM Property WHERE id = ?',
        [id]
      );
      
      await connection.end();
      return res.json(updatedProperty[0]);
    } catch (dbError) {
      console.error('Database error:', dbError);
      await connection.end();
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to update property'
      });
    }
  } catch (error) {
    console.error('Property update error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update property'
    });
  }
});

// Delete property endpoint
app.delete('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await createConnection();
    
    try {
      // Check if property exists
      const [existingProperty] = await connection.execute(
        'SELECT * FROM Property WHERE id = ?',
        [id]
      );

      if (existingProperty.length === 0) {
        await connection.end();
        return res.status(404).json({
          error: 'Property not found'
        });
      }

      const [result] = await connection.execute(
        'DELETE FROM Property WHERE id = ?',
        [id]
      );
      
      await connection.end();
      return res.json(existingProperty[0]);
    } catch (dbError) {
      console.error('Database error:', dbError);
      await connection.end();
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to delete property'
      });
    }
  } catch (error) {
    console.error('Property deletion error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete property'
    });
  }
});

// Get single property endpoint
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await createConnection();
    
    try {
      const [properties] = await connection.execute(
        'SELECT * FROM Property WHERE id = ?',
        [id]
      );
      
      if (properties.length === 0) {
        await connection.end();
        return res.status(404).json({
          error: 'Property not found'
        });
      }
      
      await connection.end();
      return res.json(properties[0]);
    } catch (dbError) {
      console.error('Database error:', dbError);
      await connection.end();
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to fetch property'
      });
    }
  } catch (error) {
    console.error('Property fetch error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch property'
    });
  }
});

// Get single agent endpoint
app.get('/api/agents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await createConnection();
    
    try {
      const [agents] = await connection.execute(
        'SELECT * FROM Agent WHERE id = ?',
        [id]
      );
      
      if (agents.length === 0) {
        await connection.end();
        return res.status(404).json({
          error: 'Agent not found'
        });
      }
      
      await connection.end();
      return res.json(agents[0]);
    } catch (dbError) {
      console.error('Database error:', dbError);
      await connection.end();
      return res.status(500).json({
        error: 'Database error',
        message: 'Failed to fetch agent'
      });
    }
  } catch (error) {
    console.error('Agent fetch error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch agent'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;