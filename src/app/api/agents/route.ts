import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Configure API route options
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb' // Increase the size limit to 50MB
    }
  }
};

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the content length from the request headers
    const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
    
    // Check if content length exceeds limit (50MB = 50 * 1024 * 1024 bytes)
    if (contentLength > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Request body too large' },
        { status: 413 }
      );
    }

    const data = await request.json();
    
    // Validate the data
    if (!data.name || !data.title || !data.email || !data.phone || !data.location || !data.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const agent = await prisma.agent.create({
      data: {
        name: data.name,
        title: data.title,
        email: data.email,
        phone: data.phone,
        location: data.location,
        description: data.description,
        image: data.image || null
      }
    });
    
    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error creating agent:', error);
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'An agent with this email already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
} 