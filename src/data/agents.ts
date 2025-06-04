import { prisma } from '@/lib/db';

export interface Agent {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ApiAgent extends Omit<Agent, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

export async function getAgent(): Promise<Agent | null> {
  const response = await fetch('/api/agents/latest');
  if (!response.ok) {
    throw new Error('Failed to fetch agent');
  }
  const agent = await response.json() as ApiAgent;
  if (!agent) return null;
  return {
    ...agent,
    createdAt: new Date(agent.createdAt),
    updatedAt: new Date(agent.updatedAt)
  };
}

export async function getAllAgents(): Promise<Agent[]> {
  const response = await fetch('/api/agents');
  if (!response.ok) {
    throw new Error('Failed to fetch agents');
  }
  const agents = await response.json() as ApiAgent[];
  return agents.map((agent) => ({
    ...agent,
    createdAt: new Date(agent.createdAt),
    updatedAt: new Date(agent.updatedAt)
  }));
}

export async function updateAgent(id: string, data: Partial<Agent>): Promise<Agent> {
  const response = await fetch(`/api/agents/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update agent');
  }
  
  const agent = await response.json() as ApiAgent;
  return {
    ...agent,
    createdAt: new Date(agent.createdAt),
    updatedAt: new Date(agent.updatedAt)
  };
}

export async function createAgent(data: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Promise<Agent> {
  const response = await fetch('/api/agents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create agent');
  }
  
  const agent = await response.json() as ApiAgent;
  return {
    ...agent,
    createdAt: new Date(agent.createdAt),
    updatedAt: new Date(agent.updatedAt)
  };
}

export async function deleteAgent(id: string): Promise<Agent> {
  const response = await fetch(`/api/agents/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete agent');
  }
  
  const agent = await response.json() as ApiAgent;
  return {
    ...agent,
    createdAt: new Date(agent.createdAt),
    updatedAt: new Date(agent.updatedAt)
  };
} 