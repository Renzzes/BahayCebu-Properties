import { prisma } from '@/lib/db';

export interface Agent {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAgent(): Promise<Agent | null> {
  return await prisma.agent.findFirst({
    orderBy: { createdAt: 'desc' }
  });
}

export async function getAllAgents(): Promise<Agent[]> {
  return await prisma.agent.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function updateAgent(id: string, data: Partial<Agent>): Promise<Agent> {
  return await prisma.agent.update({
    where: { id },
    data
  });
}

export async function createAgent(data: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Promise<Agent> {
  return await prisma.agent.create({
    data
  });
}

export async function deleteAgent(id: string): Promise<Agent> {
  return await prisma.agent.delete({
    where: { id }
  });
} 