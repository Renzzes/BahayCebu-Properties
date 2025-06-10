export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin?: string;
  preferences: {
    emailNotifications: boolean;
    smsAlerts: boolean;
    weeklyReports: boolean;
  };
}

// Global user store (simulating database)
let globalUser: AdminUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@bahaycebuproperties.com',
  password: '', // Will be set during signup
  role: 'admin',
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  preferences: {
    emailNotifications: true,
    smsAlerts: false,
    weeklyReports: true,
  }
};

// User management functions
export const getCurrentUser = (): AdminUser => {
  // Get user data from localStorage if it exists
  const storedUser = localStorage.getItem('adminUser');
  if (storedUser) {
    globalUser = JSON.parse(storedUser);
  }
  return { ...globalUser };
};

export const updateUserProfile = (updates: Partial<Pick<AdminUser, 'name' | 'email' | 'profilePicture'>>): AdminUser => {
  globalUser = {
    ...globalUser,
    ...updates,
  };
  // Save to localStorage
  localStorage.setItem('adminUser', JSON.stringify(globalUser));
  return { ...globalUser };
};

export const updateUserPassword = (newPassword: string): boolean => {
  try {
    globalUser = {
      ...globalUser,
      password: newPassword,
    };
    // Save to localStorage
    localStorage.setItem('adminUser', JSON.stringify(globalUser));
    return true;
  } catch (error) {
    return false;
  }
};

export const updateUserPreferences = (preferences: Partial<AdminUser['preferences']>): AdminUser => {
  globalUser = {
    ...globalUser,
    preferences: {
      ...globalUser.preferences,
      ...preferences,
    },
  };
  // Save to localStorage
  localStorage.setItem('adminUser', JSON.stringify(globalUser));
  return { ...globalUser };
};

export const verifyCurrentPassword = (password: string): boolean => {
  return globalUser.password === password;
};

export const updateLastLogin = (): void => {
  globalUser = {
    ...globalUser,
    lastLogin: new Date().toISOString(),
  };
  // Save to localStorage
  localStorage.setItem('adminUser', JSON.stringify(globalUser));
};

// New function to set initial user data during signup
export const setInitialUserData = (userData: Partial<AdminUser>): void => {
  globalUser = {
    ...globalUser,
    ...userData,
  };
  // Save to localStorage
  localStorage.setItem('adminUser', JSON.stringify(globalUser));
}; 