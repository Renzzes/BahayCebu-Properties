import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_db';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    return res.json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed", details: err });
  }
} 