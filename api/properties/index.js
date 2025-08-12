import { prisma } from '../_db.js';

export default async function handler(req, res) {
  // Set CORS headers for cross-domain requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://bahaycebu-properties.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, cache-control');

  // Preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
        thumbnail,
        unitTypes,
        amenities,
        residentialFeatures,
        provisions,
        buildingFeatures
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
          thumbnail,
          unitTypes: unitTypes || [],
          amenities: amenities || [],
          residentialFeatures: residentialFeatures || [],
          provisions: provisions || [],
          buildingFeatures: buildingFeatures || []
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