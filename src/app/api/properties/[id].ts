import { Request, Response } from 'express';
import { prisma } from '@/lib/db';

export async function GET(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const property = await prisma.property.findUnique({
      where: { id }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Ensure arrays are properly initialized
    const response = {
      ...property,
      images: property.images || [],
      unitTypes: property.unitTypes || ['Standard Unit'],
      amenities: property.amenities || ['24/7 Security', 'CCTV Surveillance', 'Parking'],
      residentialFeatures: property.residentialFeatures || ['Modern Kitchen', 'Quality Fixtures', 'Good Ventilation'],
      provisions: property.provisions || ['Individual Electric Meter', 'Water Connection', 'Internet Ready'],
      buildingFeatures: property.buildingFeatures || ['Well-maintained', 'Professional Management', 'Clean Environment']
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching property:', error);
    return res.status(500).json({ error: 'Failed to fetch property' });
  }
}

export async function DELETE(req: Request, res: Response) {
  const { id } = req.params;

  try {
    await prisma.property.delete({
      where: { id }
    });
    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting property:', error);
    return res.status(500).json({ error: 'Failed to delete property' });
  }
} 