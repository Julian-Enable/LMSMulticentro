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
      
      // Validate credentials
      if (credentials.username === MOCK_CREDENTIALS.username && 
          credentials.password === MOCK_CREDENTIALS.password) {
        const mockToken = 'mock-jwt-token-' + Date.now();
        return {
          token: mockToken,
          user: { ...mockUser, role: 'ADMIN' }
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
      const mockToken = 'mock-jwt-token-' + Date.now();
      return {
        token: mockToken,
        user: { ...mockUser, role: 'ADMIN' }
      };
    }
    
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { ...mockUser, role: 'ADMIN' };
    }
    
    const response = await api.get('/auth/profile');
    return response.data;
  },
};
