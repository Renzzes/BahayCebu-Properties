export const getApiBaseUrl = () => {
  if (import.meta.env.MODE === 'production') {
    return 'https://bahay-cebu-properties.vercel.app';
  }
  return 'http://localhost:8081';
};

export const getBaseUrl = () => {
  if (import.meta.env.MODE === 'production') {
    return 'https://bahay-cebu-properties.vercel.app';
  }
  return 'http://localhost:8081';
};

export const API_ROUTES = {
  properties: '/api/properties',
  agents: '/api/agents',
  auth: '/api/auth',
  googleCallback: '/auth/google/callback'
} as const; 