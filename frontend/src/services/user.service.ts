import api from './api';
import { User } from '../types';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const userService = {
  async getAll(): Promise<User[]> {
    if (USE_MOCK) {
      const storedUsers = localStorage.getItem('mockUsers');
      if (storedUsers) {
        return JSON.parse(storedUsers);
      }
      const defaultUsers: User[] = [
        {
          id: 'user-1',
          username: 'admin',
          email: 'admin@multicentro.com',
          role: 'ADMIN',
          createdAt: new Date().toISOString(),
        }
      ];
      localStorage.setItem('mockUsers', JSON.stringify(defaultUsers));
      return defaultUsers;
    }

    const response = await api.get('/users');
    return response.data;
  },

  async create(data: { username: string; email: string; password: string; role: string }): Promise<User> {
    if (USE_MOCK) {
      const storedUsers = localStorage.getItem('mockUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const newUser: User = {
        id: `user-${Date.now()}`,
        username: data.username,
        email: data.email,
        role: data.role as 'ADMIN' | 'EMPLOYEE',
        createdAt: new Date().toISOString(),
      };
      const updatedUsers = [...users, newUser];
      localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
      return newUser;
    }

    const response = await api.post('/users', data);
    return response.data;
  },

  async update(id: string, data: { username?: string; email?: string; password?: string; role?: string }): Promise<User> {
    if (USE_MOCK) {
      const storedUsers = localStorage.getItem('mockUsers');
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
      const updatedUsers = users.map(u =>
        u.id === id
          ? { ...u, ...data }
          : u
      );
      localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
      return updatedUsers.find(u => u.id === id)!;
    }

    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    if (USE_MOCK) {
      const storedUsers = localStorage.getItem('mockUsers');
      const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
      const updatedUsers = users.filter(u => u.id !== id);
      localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
      return;
    }

    await api.delete(`/users/${id}`);
  },
};
