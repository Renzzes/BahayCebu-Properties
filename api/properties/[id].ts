import { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: "Invalid ID" });
  }

  if (req.method === 'GET') {
    try {
      const property = await prisma.property.findUnique({
        where: { id }
      });
      
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      return res.status(200).json(property);
    } catch (err) {
      console.error('Error fetching property:', err);
      return res.status(500).json({ error: "Server error", details: err });
    }
  }

  if (req.method === 'PUT') {
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

      const property = await prisma.property.update({
        where: { id },
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
          amenities: amenities || [],
          residentialFeatures: residentialFeatures || [],
          provisions: provisions || [],
          buildingFeatures: buildingFeatures || []
        }
      });
      return res.status(200).json(property);
    } catch (err) {
      console.error('Error updating property:', err);
      return res.status(400).json({ error: "Invalid data or property not found", details: err });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.property.delete({ where: { id } });
      return res.status(204).end();
    } catch (err) {
      console.error('Error deleting property:', err);
      return res.status(400).json({ error: "Property not found", details: err });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
} 