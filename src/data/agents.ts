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
  specializations: string[];
  listings: number;
  deals: number;
  rating: number;
  socialMedia: {
    facebook: string;
    instagram: string;
    linkedin: string;
  };
}

interface ApiAgent extends Omit<Agent, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

export async function getAgent(): Promise<Agent> {
  const response = await fetch('/api/agents');
  if (!response.ok) {
    throw new Error('Failed to fetch agent');
  }
  const agents = await response.json() as ApiAgent[];
  // Return the first agent for now, we'll update this later to handle multiple agents
  const agent = agents[0];
  return {
    ...agent,
    createdAt: new Date(agent.createdAt),
    updatedAt: new Date(agent.updatedAt)
  };
}

export async function getAllAgentsPublic(): Promise<Agent[]> {
  const response = await fetch('/api/agents');
  if (!response.ok) {
    throw new Error('Failed to fetch agents');
  }
  const agents = await response.json() as ApiAgent[];
  return agents.map(agent => ({
    ...agent,
    createdAt: new Date(agent.createdAt),
    updatedAt: new Date(agent.updatedAt)
  }));
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
  try {
    console.log('Sending update request for agent:', id);
    console.log('Update data:', JSON.stringify(data, null, 2));

    const response = await fetch(`/api/agents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        listings: Number(data.listings) || 0,
        deals: Number(data.deals) || 0,
        rating: Number(data.rating) || 0,
        socialMedia: data.socialMedia || {
          facebook: '',
          instagram: '',
          linkedin: ''
        }
      }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error response:', errorData);
      throw new Error(errorData.details || errorData.error || 'Failed to update agent');
    }
  
    const agent = await response.json() as ApiAgent;
    console.log('Update successful, received agent:', agent);
    return {
      ...agent,
      createdAt: new Date(agent.createdAt),
      updatedAt: new Date(agent.updatedAt)
    };
  } catch (error) {
    console.error('Error in updateAgent:', error);
    throw error;
  }
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