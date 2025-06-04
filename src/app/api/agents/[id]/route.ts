import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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
    const agent = await prisma.agent.update({
      where: { id: params.id },
      data
    });
    return NextResponse.json(agent);
  } catch (error) {
    console.error('Error updating agent:', error);
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update agent' },
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