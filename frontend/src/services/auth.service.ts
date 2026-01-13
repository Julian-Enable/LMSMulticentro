import api from './api';
import { LoginCredentials, AuthResponse, User } from '../types';
import { mockUser } from '../data/mockData';

// Mock credentials for testing
const MOCK_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Check if mock mode is enabled
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get users from localStorage
      const storedUsers = localStorage.getItem('mockUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Find user by username
      const user = users.find((u: User) => u.username === credentials.username);
      
      // Validate credentials (mock: just check username exists)
      if (user) {
        const mockToken = 'mock-jwt-token-' + Date.now();
        return {
          token: mockToken,
          user: user
        };
      } else {
        throw new Error('Credenciales inválidas');
      }
    }
    
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: LoginCredentials & { email?: string }): Promise<AuthResponse> => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get users from localStorage
      const storedUsers = localStorage.getItem('mockUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const user = users.find((u: User) => u.username === data.username) || mockUser;
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      return {
        token: mockToken,
        user: { ...user, role: 'ADMIN' }
      };
    }
    
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get current user from localStorage (saved on login)
      const storedAuth = localStorage.getItem('authToken');
      const storedUsers = localStorage.getItem('mockUsers');
      
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        // Return first admin user or first user
        const adminUser = users.find((u: User) => u.role === 'ADMIN');
        if (adminUser) return adminUser;
        if (users.length > 0) return users[0];
      }
      
      return { ...mockUser, role: 'ADMIN' };
    }
    
    const response = await api.get('/auth/profile');
    return response.data;
  },
};
