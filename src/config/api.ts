export const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    return 'https://bahay-cebu-properties-rences-projects-f8660086.vercel.app';  // Use Vercel deployment for API routes
  }
  // In development, use the Vercel dev server which serves API routes
  return 'http://localhost:4000';
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