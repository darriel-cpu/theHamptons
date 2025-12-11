import { User, UserRole } from '../types';

const STORAGE_KEY = 'ppoth_user';

// Mock Users for demonstration
// In a real app, this would be in your database
const MOCK_USERS: User[] = [
  { id: 'u_admin', email: 'admin@ppoth.com', name: 'System Admin', role: 'ADMIN' },
  { id: 'u_partner', email: 'partner@hamptons.com', name: 'John Architect', role: 'PARTNER', businessId: 'biz_arch_1' },
  { id: 'u_user', email: 'user@hamptons.com', name: 'Hamptons Resident', role: 'USER' }
];

export const login = (email: string, password: string): User | null => {
  // Simple mock authentication
  // Password 'password' works for everyone, 'admin' works for admin
  if (password === 'password' || (email === 'admin@ppoth.com' && password === 'admin')) {
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    }
  }
  return null;
};

export const register = (name: string, email: string, password: string): User => {
  // Mock registration - automatically creates a USER role
  const newUser: User = {
    id: `u_${Date.now()}`,
    name,
    email,
    role: 'USER'
  };
  // Persist session
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  return newUser;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.href = '/';
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEY);
};

export const getUserRole = (): UserRole | null => {
  const user = getCurrentUser();
  return user ? user.role : null;
};