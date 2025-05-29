import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import { prisma } from "./lib/db";

const app = express();

// NEW: Global request logger middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
	console.log(`[${new Date().toISOString()}] Received ${req.method} request for ${req.url}`);
	next();
});

const corsOptions = {
	origin: "http://localhost:8080",
	credentials: true,
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

// NEW: Simple ping route for testing
app.get('/api/ping', (_req, res) => {
	console.log('PING received on backend!');
	res.send('pong from backend');
});

const PORT = 4000;

// Get all properties
app.get("/api/properties", async (_req: Request, res: Response) => {
	try {
		const properties = await prisma.property.findMany();
		return res.json(properties);
	} catch (err) {
		return res.status(500).json({ error: "Server error", details: err });
	}
});

// Get a single property
app.get("/api/properties/:id", async (req: Request, res: Response) => {
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

app.post("/api/signup", async (req: Request, res: Response) => {
  console.log("Database URL:", process.env.DATABASE_URL);
  console.log("Signup request from:", req.headers.origin);
  const { email, password, name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);

  // Debug: Check if the email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });
  console.log("Existing user check:", existingUser);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    console.log("User created:", user);
    return res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (err: unknown) {
    console.error("Signup error details. Email attempted:", email, "Full error:", err);
    if (typeof err === 'object' && err !== null && 'code' in err && err.code === "P2002") {
      return res.status(400).json({ error: "Email already exists" });
    }
    return res.status(400).json({ error: "Signup failed", details: err instanceof Error ? err.message : String(err) });
  }
});

// Update a property
app.put("/api/properties/:id", async (req: Request, res: Response) => {
	try {
		const property = await prisma.property.update({
			where: { id: req.params.id },
			data: req.body,
		});
		return res.json(property);
	} catch (err) {
		return res
			.status(400)
			.json({ error: "Invalid data or not found", details: err });
	}
});

// Delete a property
app.delete("/api/properties/:id", async (req: Request, res: Response) => {
	try {
		await prisma.property.delete({ where: { id: req.params.id } });
		return res.status(204).end();
	} catch (err) {
		return res.status(400).json({ error: "Not found", details: err });
	}
});

// Login endpoint
app.post("/api/login", async (req: Request, res: Response) => {
	const { email, password } = req.body;
	console.log("Login attempt with email:", email);
	
	try {
		const user = await prisma.user.findUnique({ where: { email } });
		console.log("User found:", user ? "Yes" : "No");
		
		if (!user) return res.status(401).json({ error: "Invalid credentials" });

		console.log("Comparing password with hash...");
		const isValid = await bcrypt.compare(password, user.password);
		console.log("Password valid:", isValid);
		
		if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

		return res.json({ id: user.id, email: user.email, name: user.name });
	} catch (err) {
		console.error("Login error:", err);
		return res.status(500).json({ error: "Login failed", details: err });
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

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
