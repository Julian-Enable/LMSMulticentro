import { Category, Video, User } from '../types';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Capacitación General',
    description: 'Cursos y videos de capacitación general para empleados',
    isActive: true,
    videoCount: 0,
    order: 1,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '2',
    name: 'Seguridad y Salud',
    description: 'Protocolos de seguridad y salud ocupacional',
    isActive: true,
    videoCount: 0,
    order: 2,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
  {
    id: '3',
    name: 'Procedimientos Operativos',
    description: 'Procesos y procedimientos operativos estándar',
    isActive: true,
    videoCount: 0,
    order: 3,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString(),
  },
];

export const mockVideos: Video[] = [];

export const mockUser: User = {
  id: 'user-1',
  username: 'Roberto Gómez',
  email: 'admin@multicentro.com',
  role: 'EMPLOYEE',
  createdAt: new Date('2024-01-01').toISOString(),
};
