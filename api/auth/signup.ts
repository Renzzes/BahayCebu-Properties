import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_db';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    return res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (err: unknown) {
    console.error("Signup error details. Email attempted:", email, "Full error:", err);
    if (typeof err === 'object' && err !== null && 'code' in err && err.code === "P2002") {
      return res.status(400).json({ error: "Email already exists" });
    }
    return res.status(400).json({ error: "Signup failed", details: err instanceof Error ? err.message : String(err) });
  }
} 