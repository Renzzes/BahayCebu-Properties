# BahayCebu Properties Authentication Guide

## Overview

This guide outlines the standardized authentication implementation for the BahayCebu Properties application. Currently, there are three different implementations of Google authentication:

1. **Vercel Serverless Functions** (in `/api` directory)
2. **Express Backend** (in `src/server.ts`)
3. **Standalone API** (in `backend-api.js`)

To ensure consistency and reliability, we recommend standardizing on a single approach.

## Recommended Authentication Implementation

### Option 1: Express Backend (src/server.ts)

This is the most integrated approach as it works directly with the Prisma ORM and provides a clean API structure.

```typescript
// Google authentication endpoint in src/server.ts
app.post("/api/auth/google", async (req: Request, res: Response) => {
  try {
    const { email, name, picture, googleId } = req.body;
    
    // Validate required fields
    if (!email || !name || !googleId) {
      return applyCorsHeaders(res).status(400).json({ 
        error: "Validation Error",
        message: "Email, name, and googleId are required"
      });
    }
    
    // Test database connection
    try {
      await prisma.$connect();
      console.log("Database connection successful");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return applyCorsHeaders(res).status(500).json({
        error: "Server Error",
        message: "Database connection failed"
      });
    }
    
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      // Create new user
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          profilePicture: picture,
          googleId
        }
      });
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { email },
        data: {
          googleId,
          profilePicture: picture || user.profilePicture
        }
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    return applyCorsHeaders(res).status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return applyCorsHeaders(res).status(500).json({ 
      error: "Authentication failed",
      message: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
});
```

### Option 2: Standalone API (backend-api.js)

This approach is suitable for deployment to environments where Node.js is available but Prisma might be challenging to set up.

```javascript
// Google authentication endpoint in backend-api.js
app.post('/api/auth/google', async (req, res) => {
  try {
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
```

## Frontend Implementation

The frontend should use a consistent approach to call the authentication API:

```typescript
// Example of frontend Google authentication
const handleGoogleLogin = async (credentialResponse: any) => {
  try {
    // Decode the credential to get user info
    const decoded = jwtDecode(credentialResponse.credential);
    
    // Extract user information
    const { email, name, picture, sub: googleId } = decoded;
    
    // Call the backend API
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        name,
        picture,
        googleId
      }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    
    const data = await response.json();
    
    // Store the token and user info
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Redirect or update UI
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Google login error:', error);
    // Handle error
  }
};
```

## Environment Variables

Ensure these environment variables are set in all deployment environments:

```
# JWT Configuration
JWT_SECRET=bahaycebu-jwt-secret-2024

# Google OAuth Configuration
GOOGLE_CLIENT_ID=897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=G8C5PX-4PpfFHJ-PJ1L4CTjSZ9nONV1qxt8
GOOGLE_REDIRECT_URI=https://bahaycebu-properties.com/auth/google/callback

# Frontend Configuration
VITE_GOOGLE_CLIENT_ID=897144997266-c4nm53c10808l9oj00t282p7iq3ogesp.apps.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=https://bahaycebu-properties.com/auth/google/callback
VITE_API_URL=https://api.bahaycebu-properties.com
VITE_BASE_URL=https://bahaycebu-properties.com
```

## Recommendations

1. **Choose One Implementation**: Standardize on either the Express Backend or Standalone API approach.
2. **Consistent Error Handling**: Ensure all authentication endpoints return consistent error formats.
3. **Logging**: Implement comprehensive logging for authentication attempts and failures.
4. **Security**: Always use HTTPS for API endpoints and secure JWT secrets.
5. **Testing**: Regularly test the authentication flow in all environments.

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the API server has proper CORS headers for the frontend domain.
2. **Database Connection**: Verify database credentials and connection parameters.
3. **JWT Verification**: Ensure the same JWT secret is used for signing and verification.
4. **Google OAuth**: Check if the Google OAuth credentials are properly configured.