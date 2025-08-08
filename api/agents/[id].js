import { prisma } from '../_db.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (req.method === 'GET') {
    try {
      const agent = await prisma.agent.findUnique({
        where: { id }
      });
      if (!agent) return res.status(404).json({ error: "Agent not found" });
      return res.status(200).json(agent);
    } catch (error) {
      console.error('Error fetching agent:', error);
      return res.status(500).json({ error: 'Failed to fetch agent' });
    }
  }

  if (req.method === 'PUT') {
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

      // Check if email is being changed and if it's already in use by another agent
      const existingAgent = await prisma.agent.findFirst({
        where: {
          email,
          NOT: {
            id
          }
        }
      });

      if (existingAgent) {
        return res.status(400).json({ error: 'An agent with this email already exists' });
      }

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

      const updatedAgent = await prisma.agent.update({
        where: { id },
        data: updateData
      });

      return res.status(200).json(updatedAgent);
    } catch (error) {
      console.error('Error updating agent:', error);
      if (error instanceof Error && error.message.includes('Record to update not found')) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      return res.status(500).json({ error: 'Failed to update agent' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const agent = await prisma.agent.delete({
        where: { id }
      });
      return res.status(200).json(agent);
    } catch (error) {
      console.error('Error deleting agent:', error);
      if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      return res.status(500).json({ error: 'Failed to delete agent' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}