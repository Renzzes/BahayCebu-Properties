import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb'
    }
  }
};

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    console.log('Update request data:', data);
    console.log('Agent ID:', params.id);

    // Validate required fields
    if (!data.name || !data.title || !data.email || !data.phone || !data.location || !data.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email is being changed and if it's already in use by another agent
    if (data.email) {
      const existingAgent = await prisma.agent.findFirst({
        where: {
          email: data.email,
          NOT: {
            id: params.id
          }
        }
      });

      if (existingAgent) {
        return NextResponse.json(
          { error: 'An agent with this email already exists' },
          { status: 400 }
        );
      }
    }

    // Prepare the update data with proper type handling
    const updateData = {
      name: String(data.name),
      title: String(data.title),
      email: String(data.email),
      phone: String(data.phone),
      location: String(data.location),
      description: String(data.description),
      image: data.image || null,
      specializations: Array.isArray(data.specializations) ? data.specializations : [],
      listings: Number(data.listings) || 0,
      deals: Number(data.deals) || 0,
      rating: Number(data.rating) || 0,
      socialMedia: typeof data.socialMedia === 'object' ? 
        JSON.stringify({
          facebook: data.socialMedia.facebook || '',
          instagram: data.socialMedia.instagram || '',
          linkedin: data.socialMedia.linkedin || ''
        }) : 
        '{"facebook":"","instagram":"","linkedin":""}'
    };

    console.log('Processed update data:', updateData);

    const agent = await prisma.agent.update({
      where: { id: params.id },
      data: updateData
    });
    
    console.log('Updated agent:', agent);
    return NextResponse.json(agent);
  } catch (error) {
    console.error('Detailed error updating agent:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An agent with this email already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update agent' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const agent = await prisma.agent.delete({
      where: { id: params.id }
    });
    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error deleting agent:', error);
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    );
  }
} 