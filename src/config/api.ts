export const getApiBaseUrl = () => {
  if (import.meta.env.MODE === 'production') {
    return import.meta.env.VITE_API_URL || 'https://api.bahaycebu-properties.com';
  }
  return 'http://localhost:4000';
};

export const getBaseUrl = () => {
  if (import.meta.env.MODE === 'production') {
    return import.meta.env.VITE_BASE_URL || 'https://bahaycebu-properties.com';
  }
  return 'http://localhost:8081';
};

export const API_ROUTES = {
  properties: '/api/properties',
  agents: '/api/agents',
  auth: '/api/auth',
} as const; 