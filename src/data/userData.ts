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
  password: 'admin123456', // In real app, this would be hashed
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
  return { ...globalUser };
};

export const updateUserProfile = (updates: Partial<Pick<AdminUser, 'name' | 'email' | 'profilePicture'>>): AdminUser => {
  globalUser = {
    ...globalUser,
    ...updates,
  };
  return { ...globalUser };
};

export const updateUserPassword = (newPassword: string): boolean => {
  try {
    // In a real application, you would hash the password here
    globalUser = {
      ...globalUser,
      password: newPassword,
    };
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
}; 