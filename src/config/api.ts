export const getApiBaseUrl = () => {
  if (import.meta.env.MODE === 'production') {
    return 'https://api.bahaycebu-properties.com';  // Use a dedicated API subdomain
  }
  return 'http://localhost:8081';
};

export const getBaseUrl = () => {
  if (import.meta.env.MODE === 'production') {
    return 'https://bahaycebu-properties.com';  // Main frontend domain
  }
  return 'http://localhost:8081';
};

export const API_ROUTES = {
  properties: '/api/properties',
  agents: '/api/agents',
  auth: '/api/auth',
  google: {
    token: '/api/auth/google/token',
    callback: '/api/auth/google',
  }
}; 