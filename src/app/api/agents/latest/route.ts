import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://bahaycebu-properties.com',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, cache-control',
  'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function GET() {
  try {
    const agent = await prisma.agent.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(agent, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching latest agent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest agent' },
      { status: 500, headers: corsHeaders }
    );
  }
}