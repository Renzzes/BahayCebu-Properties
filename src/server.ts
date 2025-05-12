import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { prisma } from './lib/db';

const app = express();

// Configure CORS
const corsOptions = {
  origin: '*', // Allow ALL origins (for debugging)
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Optional: Specify allowed methods
  optionsSuccessStatus: 204 // Add this back for preflight requests
};
app.use(cors(corsOptions));

app.use(express.json());
const PORT = 4000;

// Get all properties
app.get('/api/properties', async (_req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany();
    return res.json(properties);
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err });
  }
});

// Get a single property
app.get('/api/properties/:id', async (req: Request, res: Response) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: req.params.id },
    });
    if (!property) return res.status(404).json({ error: 'Not found' });
    return res.json(property);
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err });
  }
});

// Create a property
app.post('/api/properties', async (req: Request, res: Response) => {
  try {
    const property = await prisma.property.create({ data: req.body });
    return res.status(201).json(property);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid data', details: err });
  }
});

// Update a property
app.put('/api/properties/:id', async (req: Request, res: Response) => {
  try {
    const property = await prisma.property.update({
      where: { id: req.params.id },
      data: req.body,
    });
    return res.json(property);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid data or not found', details: err });
  }
});

// Delete a property
app.delete('/api/properties/:id', async (req: Request, res: Response) => {
  try {
    await prisma.property.delete({ where: { id: req.params.id } });
    return res.status(204).end();
  } catch (err) {
    return res.status(400).json({ error: 'Not found', details: err });
  }
});

// Signup endpoint
app.post('/api/signup', async (req: Request, res: Response) => {
  console.log('Signup request from:', req.headers.origin); // Debug log
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    return res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (err: any) {
    console.error('Signup error:', err);
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    return res.status(400).json({ error: 'Signup failed', details: err.message });
  }
});

// Login endpoint
app.post('/api/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    return res.json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed', details: err });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});