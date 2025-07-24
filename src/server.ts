import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { prisma } from "./lib/db";
import { User } from "./types/api";
import { UserCreateInputType, UserUpdateInputType } from "./types/prisma-extensions";
import { gmailService } from "./utils/gmailService";
import { authenticateToken, AuthRequest } from './middleware/auth';

const app = express();

// Middleware setup
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] Received ${req.method} request for ${req.url}`);
  next();
});

const corsOptions = {
  origin: [
    "http://localhost:8080", 
    "http://localhost:3000", 
    "http://localhost:5173",
    "http://localhost:8081",
    "http://localhost:4000",
    process.env.PRODUCTION_URL || "", 
    "https://bahaycebu-properties.vercel.app"
  ].filter((url): url is string => !!url),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Public routes
app.get('/api/ping', (_req, res) => {
  console.log('PING received on backend!');
  res.send('pong from backend');
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
	const { email, password } = req.body;
	console.log("Login attempt with email:", email);
	
	if (!email || !password) {
		return res.status(400).json({ 
			error: "Validation Error",
			message: "Email and password are required"
		});
	}

	try {
		// Test database connection
		try {
			await prisma.$connect();
			console.log('Database connection successful');
		} catch (dbError) {
			console.error('Database connection error:', dbError);
			return res.status(500).json({ 
				error: "Server Error",
				message: "Unable to connect to the database. Please try again later."
			});
		}

		const user = await prisma.user.findUnique({ where: { email } });
		
		if (!user) {
			console.log("User not found:", email);
			return res.status(401).json({ 
				error: "Authentication Error",
				message: "Invalid email or password"
			});
		}

		const isValid = await bcrypt.compare(password, user.password);
		
		if (!isValid) {
			console.log("Invalid password for user:", email);
			return res.status(401).json({ 
				error: "Authentication Error",
				message: "Invalid email or password"
			});
		}

		console.log("Login successful for user:", email);
		return res.status(200).json({
			id: user.id,
			email: user.email,
			name: user.name,
			message: "Login successful"
		});
	} catch (err) {
		console.error("Login error:", err);
		return res.status(500).json({
			error: "Server Error",
			message: "Failed to process login. Please try again later.",
			details: process.env.NODE_ENV === 'development' ? (err instanceof Error ? err.message : "Unknown error") : undefined
		});
	} finally {
		try {
			await prisma.$disconnect();
		} catch (disconnectError) {
			console.error('Error disconnecting from database:', disconnectError);
		}
	}
});

app.post("/api/auth/signup", async (req: Request, res: Response) => {
	console.log("=== Signup Request ===");
	console.log("Request body:", req.body);
	console.log("Database URL:", process.env.DATABASE_URL);
	console.log("Request headers:", req.headers);
	
	const { email, password, name } = req.body;
	
	// Validation logging
	console.log("Validation checks:");
	console.log("- Name provided:", !!name);
	console.log("- Email provided:", !!email);
	console.log("- Password provided:", !!password);
	console.log("- Password length:", password?.length);
	
	if (!name) {
		console.log("Validation failed: Name is required");
		return res.status(400).json({ 
			error: "Validation Error",
			message: "Name is required"
		});
	}

	if (!email) {
		console.log("Validation failed: Email is required");
		return res.status(400).json({ 
			error: "Validation Error",
			message: "Email is required"
		});
	}

	if (!password) {
		console.log("Validation failed: Password is required");
		return res.status(400).json({ 
			error: "Validation Error",
			message: "Password is required"
		});
	}

	if (password.length < 8) {
		console.log("Validation failed: Password too short");
		return res.status(400).json({ 
			error: "Validation Error",
			message: "Password must be at least 8 characters long"
		});
	}

	try {
		// Test database connection first
		console.log("Testing database connection...");
		try {
			await prisma.$connect();
			console.log("Database connection successful");
		} catch (dbError) {
			console.error("Database connection error:", dbError);
			return res.status(500).json({
				error: "Server Error",
				message: "Database connection failed"
			});
		}
		
		const hashedPassword = await bcrypt.hash(password, 10);
		console.log("Password hashed successfully");

		// Debug: Check if the email already exists
		const existingUser = await prisma.user.findUnique({
			where: { email: email },
		});
		console.log("Existing user check:", existingUser ? "User exists" : "No existing user");

		if (existingUser) {
			console.log("Signup failed: Email already exists");
			return res.status(400).json({ 
				error: "Validation Error",
				message: "An account with this email already exists"
			});
		}

		const user = await prisma.user.create({
			data: { 
				email, 
				password: hashedPassword, 
				name 
			},
		});
		console.log("User created successfully:", { id: user.id, email: user.email, name: user.name });

		return res.status(201).json({ 
			id: user.id, 
			email: user.email, 
			name: user.name,
			message: "Account created successfully"
		});
	} catch (err: unknown) {
		console.error("=== Signup Error ===");
		console.error("Error details:", err);
		console.error("Email attempted:", email);
		
		if (err instanceof Error) {
			console.error("Error message:", err.message);
			console.error("Error stack:", err.stack);
		}

		if (typeof err === 'object' && err !== null && 'code' in err && err.code === "P2002") {
			return res.status(400).json({ 
				error: "Validation Error",
				message: "An account with this email already exists"
			});
		}

		return res.status(500).json({ 
			error: "Server Error",
			message: "Failed to create account. Please try again later.",
			details: process.env.NODE_ENV === 'development' ? (err instanceof Error ? err.message : "Unknown error") : undefined
		});
	} finally {
		try {
			await prisma.$disconnect();
			console.log("Database disconnected successfully");
		} catch (disconnectError) {
			console.error("Error disconnecting from database:", disconnectError);
		}
	}
});

// Add Google auth endpoint
app.post("/api/auth/google", async (req: Request, res: Response) => {
  try {
    const { email, name, picture, googleId } = req.body;
    console.log("Google auth request:", { email, name, googleId });

    if (!email || !name || !googleId) {
      return res.status(400).json({ 
        error: "Validation Error",
        message: "Email, name, and googleId are required"
      });
    }

    // Test database connection first
    try {
      await prisma.$connect();
      console.log("Database connection successful");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return res.status(500).json({
        error: "Server Error",
        message: "Database connection failed"
      });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Create new user if doesn't exist
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
      console.log("Created new user with Google auth:", user.email);
    } else {
      // Update existing user's Google info
      user = await prisma.user.update({
        where: { email },
        data: {
          googleId,
          profilePicture: picture || user.profilePicture
        }
      });
      console.log("Updated existing user with Google auth:", user.email);
    }

    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(500).json({ 
      error: "Authentication failed",
      message: error instanceof Error ? error.message : "Unknown error occurred"
    });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error('Error disconnecting from database:', disconnectError);
    }
  }
});

// Protected routes
app.get("/api/properties", authenticateToken, async (req: AuthRequest, res: Response) => {
	try {
		const properties = await prisma.property.findMany();
		return res.json(properties);
	} catch (err) {
		return res.status(500).json({ error: "Server error", details: err });
	}
});

app.get("/api/properties/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
	try {
		const property = await prisma.property.findUnique({
			where: { id: req.params.id },
		});
		if (!property) return res.status(404).json({ error: "Not found" });
		return res.json(property);
	} catch (err) {
		return res.status(500).json({ error: "Server error", details: err });
	}
});

// Protected admin routes
app.post("/api/properties", authenticateToken, async (req: AuthRequest, res: Response) => {
	try {
		const data = req.body;
		
		// Validate required fields
		if (!data.title || !data.location || !data.description) {
			return res.status(400).json({ 
				error: "Missing required fields: title, location, or description" 
			});
		}

		const property = await prisma.property.create({
			data: {
				title: data.title,
				price: parseFloat(data.price?.toString() || '0'),
				location: data.location,
				bedrooms: parseInt(data.bedrooms?.toString() || '0'),
				bathrooms: parseInt(data.bathrooms?.toString() || '0'),
				area: parseFloat(data.area?.toString() || '0'),
				type: data.type || 'Condo',
				featured: data.featured || false,
				description: data.description,
				images: data.images || [],
				videoUrl: data.videoUrl || '',
				thumbnail: data.thumbnail || '',
				unitTypes: data.unitTypes || [],
				unitTypeDetails: data.unitTypeDetails || [],
				amenities: data.amenities || [],
				residentialFeatures: data.residentialFeatures || [],
				provisions: data.provisions || [],
				buildingFeatures: data.buildingFeatures || [],
				createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
				updatedAt: new Date()
			}
		});

		return res.status(201).json(property);
	} catch (err) {
		return res.status(500).json({ error: "Server error", details: err });
	}
});

app.put("/api/properties/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
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
			unitTypeDetails,
			amenities,
			residentialFeatures,
			provisions,
			buildingFeatures
		} = req.body;

		const property = await prisma.property.update({
			where: { id: req.params.id },
			data: {
				title,
				price: price ? parseFloat(price) : undefined,
				location,
				bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
				bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
				area: area ? parseFloat(area) : undefined,
				type,
				featured,
				description,
				images,
				videoUrl,
				thumbnail,
				unitTypes: unitTypes || [],
				unitTypeDetails: unitTypeDetails || [],
				amenities: amenities || [],
				residentialFeatures: residentialFeatures || [],
				provisions: provisions || [],
				buildingFeatures: buildingFeatures || []
			}
		});
		return res.json(property);
	} catch (err) {
		return res.status(500).json({ error: "Server error", details: err });
	}
});

app.delete("/api/properties/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
	try {
		await prisma.property.delete({ where: { id: req.params.id } });
		return res.status(204).end();
	} catch (err) {
		return res.status(500).json({ error: "Server error", details: err });
	}
});

// Test route to create a user with a known password (for debugging)
app.get("/api/test-create-user", async (_req: Request, res: Response) => {
	try {
		const email = "test@example.com";
		const password = "password123";
		const name = "Test User";
		
		// Delete existing user if any
		try {
			const existingUser = await prisma.user.findUnique({ where: { email } });
			if (existingUser) {
				await prisma.user.delete({ where: { email } });
				console.log("Deleted existing test user");
			}
		} catch (err) {
			console.log("No existing user to delete");
		}
		
		const hashedPassword = await bcrypt.hash(password, 10);
		console.log("Generated hash for 'password123':", hashedPassword);
		
		const user = await prisma.user.create({
			data: { email, password: hashedPassword, name },
		});
		
		console.log("Test user created:", user);
		return res.json({ 
			message: "Test user created", 
			user: { id: user.id, email: user.email, name: user.name },
			password: "password123" // Only returned for this test route
		});
	} catch (err) {
		console.error("Test user creation error:", err);
		return res.status(500).json({ error: "Failed to create test user", details: err });
	}
});

// Test database connection
app.get("/api/test-db", async (_req: Request, res: Response) => {
  try {
    await prisma.$connect();
    console.log("Database connection test successful");
    
    // Try a simple query
    const userCount = await prisma.user.count();
    console.log("User count:", userCount);
    
    return res.json({ 
      status: "success",
      message: "Database connection successful",
      userCount 
    });
  } catch (error) {
    console.error("Database connection test failed:", error);
    return res.status(500).json({ 
      status: "error",
      message: "Database connection failed",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  } finally {
    await prisma.$disconnect();
  }
});

// Get all agents
app.get("/api/agents", async (_req: Request, res: Response) => {
	try {
		const agents = await prisma.agent.findMany({
			orderBy: { createdAt: 'desc' }
		});
		return res.json(agents);
	} catch (error) {
		console.error('Error fetching agents:', error);
		return res.status(500).json({ error: 'Failed to fetch agents' });
	}
});

// Get latest agent
app.get("/api/agents/latest", async (_req: Request, res: Response) => {
	try {
		const agent = await prisma.agent.findFirst({
			orderBy: { createdAt: 'desc' }
		});
		return res.json(agent);
	} catch (error) {
		console.error('Error fetching latest agent:', error);
		return res.status(500).json({ error: 'Failed to fetch latest agent' });
	}
});

// Create new agent
app.post("/api/agents", async (req: Request, res: Response) => {
	try {
		const { 
			name, 
			title, 
			email, 
			phone, 
			location, 
			description, 
			image,
			specializations,
			listings,
			deals,
			rating,
			socialMedia
		} = req.body;
		
		if (!name || !title || !email || !phone || !location || !description) {
			return res.status(400).json({ error: 'Missing required fields' });
		}

		const agent = await prisma.agent.create({
			data: {
				name,
				title,
				email,
				phone,
				location,
				description,
				image: image || null,
				specializations: specializations || [],
				listings: listings || 0,
				deals: deals || 0,
				rating: rating || 0,
				socialMedia: socialMedia || {
					facebook: '',
					instagram: '',
					linkedin: ''
				}
			}
		});
		
		return res.json(agent);
	} catch (error) {
		console.error('Error creating agent:', error);
		if (error instanceof Error && error.message.includes('Unique constraint')) {
			return res.status(400).json({ error: 'An agent with this email already exists' });
		}
		return res.status(500).json({ error: 'Failed to create agent' });
	}
});

// Update agent
app.put("/api/agents/:id", async (req: Request, res: Response) => {
	try {
		// Log the incoming request data
		console.log('Update agent request - ID:', req.params.id);
		console.log('Update agent request - Body:', JSON.stringify(req.body, null, 2));

		// Validate required fields
		const { name, title, email, phone, location, description, image, specializations, listings, deals, rating, socialMedia } = req.body;

		if (!name || !title || !email || !phone || !location || !description) {
			console.log('Missing required fields:', { name, title, email, phone, location, description });
			return res.status(400).json({ error: 'Missing required fields' });
		}

		// Check if the agent exists first
		const existingAgentCheck = await prisma.agent.findUnique({
			where: { id: req.params.id }
		});

		if (!existingAgentCheck) {
			console.log('Agent not found:', req.params.id);
			return res.status(404).json({ error: 'Agent not found' });
		}

		// Check if email is being changed and if it's already in use by another agent
		const existingAgent = await prisma.agent.findFirst({
			where: {
				email,
				NOT: {
					id: req.params.id
				}
			}
		});

		if (existingAgent) {
			console.log('Email already in use:', email);
			return res.status(400).json({ error: 'An agent with this email already exists' });
		}

		// Prepare the update data with proper type handling
		const updateData = {
			name: String(name),
			title: String(title),
			email: String(email),
			phone: String(phone),
			location: String(location),
			description: String(description),
			image: image || null,
			specializations: Array.isArray(specializations) ? specializations : [],
			listings: Number(listings) || 0,
			deals: Number(deals) || 0,
			rating: Number(rating) || 0,
			socialMedia: {
				facebook: socialMedia?.facebook || '',
				instagram: socialMedia?.instagram || '',
				linkedin: socialMedia?.linkedin || ''
			}
		};

		console.log('Update data prepared:', JSON.stringify(updateData, null, 2));

		// Update agent
		const updatedAgent = await prisma.agent.update({
			where: { id: req.params.id },
			data: updateData
		});

		console.log('Agent updated successfully:', JSON.stringify(updatedAgent, null, 2));
		return res.json(updatedAgent);
	} catch (error) {
		console.error('Detailed error in update agent:', error);
		if (error instanceof Error) {
			console.error('Error message:', error.message);
			console.error('Error stack:', error.stack);
		}
		if (error instanceof Error && error.message.includes('Record to update not found')) {
			return res.status(404).json({ error: 'Agent not found' });
		}
		return res.status(500).json({ error: 'Failed to update agent', details: error instanceof Error ? error.message : 'Unknown error' });
	}
});

// Delete agent
app.delete("/api/agents/:id", async (req: Request, res: Response) => {
	try {
		const agent = await prisma.agent.delete({
			where: { id: req.params.id }
		});
		return res.json(agent);
	} catch (error) {
		console.error('Error deleting agent:', error);
		if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
			return res.status(404).json({ error: 'Agent not found' });
		}
		return res.status(500).json({ error: 'Failed to delete agent' });
	}
});

// Generate OTP function
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Request OTP endpoint
app.post("/api/auth/request-otp", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        error: "Validation Error",
        message: "Email is required"
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ 
        error: "Not Found",
        message: "No account found with this email"
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 600000); // 10 minutes from now

    // Save OTP and expiry in database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp,
        otpExpiry
      } as { otp: string | null; otpExpiry: Date | null }
    });

    // Send OTP via email
    await gmailService.sendOTP(email, otp);

    return res.status(200).json({
      message: "OTP has been sent to your email"
    });
  } catch (error) {
    console.error("Request OTP error:", error);
    return res.status(500).json({ 
      error: "Server Error",
      message: "Failed to send OTP"
    });
  }
});

// Verify OTP endpoint
app.post("/api/auth/verify-otp", async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        error: "Validation Error",
        message: "Email and OTP are required"
      });
    }

    // Find user with valid OTP
    const user = await prisma.user.findUnique({
      where: { email }
    }) as User & { otp: string | null; otpExpiry: Date | null };

    if (!user || user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ 
        error: "Invalid OTP",
        message: "Invalid or expired OTP"
      });
    }

    // Clear OTP after successful verification
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otp: null,
        otpExpiry: null
      } as { otp: string | null; otpExpiry: Date | null }
    });

    // Generate a temporary token for password reset
    const tempToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '5m' }
    );

    return res.status(200).json({
      message: "OTP verified successfully",
      tempToken
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ 
      error: "Server Error",
      message: "Failed to verify OTP"
    });
  }
});

// Reset password with verified OTP
app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
  try {
    const { tempToken, newPassword } = req.body;

    if (!tempToken || !newPassword) {
      return res.status(400).json({ 
        error: "Validation Error",
        message: "Token and new password are required"
      });
    }

    // Verify temporary token
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET || 'your-jwt-secret') as { userId: string };
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        password: hashedPassword
      }
    });

    return res.status(200).json({
      message: "Password has been reset successfully"
    });
  } catch (error) {
    console.error("Reset password error:", error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ 
        error: "Invalid Token",
        message: "Password reset token is invalid"
      });
    }

    return res.status(500).json({ 
      error: "Server Error",
      message: "Failed to reset password"
    });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
