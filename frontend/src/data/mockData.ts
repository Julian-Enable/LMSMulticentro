import { Category, Video, User } from '../types';

export const mockCategories: Category[] = [];

export const mockVideos: Video[] = [];

export const mockUser: User = {
  id: 'user-1',
  username: 'Roberto Gómez',
  email: 'admin@multicentro.com',
  role: 'EMPLOYEE',
  createdAt: new Date('2024-01-01').toISOString(),
};
