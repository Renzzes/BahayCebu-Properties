import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const properties = await prisma.property.findMany();
      return res.status(200).json(properties);
    } catch (err) {
      return res.status(500).json({ error: "Server error", details: err });
    }
  }

  if (req.method === 'POST') {
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
        thumbnail
      } = req.body;

      // Validate required fields
      if (!title || !price || !location || !bedrooms || !bathrooms || !area || !type) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const property = await prisma.property.create({
        data: {
          title,
          price: parseFloat(price),
          location,
          bedrooms: parseInt(bedrooms),
          bathrooms: parseInt(bathrooms),
          area: parseFloat(area),
          type,
          featured: featured || false,
          description,
          images: images || [],
          videoUrl,
          thumbnail
        }
      });

      return res.status(201).json(property);
    } catch (error) {
      console.error('Error creating property:', error);
      return res.status(500).json({ error: "Failed to create property" });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
} 