import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const agent = await prisma.agent.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error fetching latest agent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest agent' },
      { status: 500 }
    );
  }
} 