import { prisma } from '../_db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const agents = await prisma.agent.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return res.status(200).json(agents);
    } catch (error) {
      console.error('Error fetching agents:', error);
      return res.status(500).json({ error: 'Failed to fetch agents' });
    }
  }

  if (req.method === 'POST') {
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
      
      return res.status(201).json(agent);
    } catch (error) {
      console.error('Error creating agent:', error);
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        return res.status(400).json({ error: 'An agent with this email already exists' });
      }
      return res.status(500).json({ error: 'Failed to create agent' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}