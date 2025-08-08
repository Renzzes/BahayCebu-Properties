import { prisma } from '../_db.js';

export default async function handler(req, res) {
  // Set CORS headers for cross-domain requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://bahaycebu-properties.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
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

      // Ensure array fields are initialized
      const response = {
        ...property,
        images: property.images || [],
        unitTypes: property.unitTypes || [],
        amenities: property.amenities || [],
        residentialFeatures: property.residentialFeatures || [],
        provisions: property.provisions || [],
        buildingFeatures: property.buildingFeatures || []
      };
      
      return res.status(200).json(response);
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