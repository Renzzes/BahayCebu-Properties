// Use consistent token key across the application
const TOKEN_KEY = 'token';

export const setToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to store token:', error);
  }
};

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to retrieve token:', error);
    return null;
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('user'); // Also remove user data
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Basic JWT validation - check if token has proper structure
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decode payload to check expiration
    const payload = JSON.parse(atob(parts[1]));
    const now = Date.now() / 1000;
    
    if (payload.exp && payload.exp < now) {
      removeToken(); // Remove expired token
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Token validation failed:', error);
    removeToken(); // Remove invalid token
    return false;
  }
};

export const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token available');
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Get user data from localStorage
export const getUser = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Failed to retrieve user data:', error);
    return null;
  }
};