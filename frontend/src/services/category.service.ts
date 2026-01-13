import api from './api';
import { Category } from '../types';
import { mockCategories } from '../data/mockData';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true';

export const categoryService = {
  getAll: async (isActive?: boolean): Promise<Category[]> => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockCategories.filter(c => isActive === undefined || c.isActive === isActive));
    }
    const params = isActive !== undefined ? `?isActive=${isActive}` : '';
    const response = await api.get(`/categories${params}`);
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    if (USE_MOCK_DATA) {
      const category = mockCategories.find(c => c.id === id);
      return Promise.resolve(category || mockCategories[0]);
    }
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data: Partial<Category>): Promise<Category> => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ ...mockCategories[0], ...data, id: String(Date.now()) } as Category);
    }
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ ...mockCategories[0], ...data, id } as Category);
    }
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      return Promise.resolve();
    }
    await api.delete(`/categories/${id}`);
  },
};
