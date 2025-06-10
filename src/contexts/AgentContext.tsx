import React, { createContext, useContext, useEffect, useState } from 'react';
import { Agent, getAgent } from '@/data/agents';

interface AgentContextType {
  agent: Agent | null;
  loading: boolean;
  error: Error | null;
  refreshAgent: () => Promise<void>;
}

const AgentContext = createContext<AgentContextType>({
  agent: null,
  loading: true,
  error: null,
  refreshAgent: async () => {},
});

export const useAgent = () => useContext(AgentContext);

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAgent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAgent();
      setAgent(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch agent'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgent();
  }, []);

  const refreshAgent = async () => {
    await fetchAgent();
  };

  return (
    <AgentContext.Provider value={{ agent, loading, error, refreshAgent }}>
      {children}
    </AgentContext.Provider>
  );
}; 