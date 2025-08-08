export const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return 'https://api.bahaycebu-properties.com';  // Use a dedicated API subdomain
  }
  return 'http://localhost:3000';  // Vercel dev server default port
};

export const getBaseUrl = () => {
  if (import.meta.env.PROD) {
    return 'https://bahaycebu-properties.com';  // Main frontend domain
  }
  return 'http://localhost:3000';  // Vercel dev server default port
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