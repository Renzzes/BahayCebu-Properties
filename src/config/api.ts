export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Use current origin for both development and production
  return window.location.origin;
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