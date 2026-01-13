import api from './api';
import { Category } from '../types';
import { mockCategories } from '../data/mockData';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true';
const STORAGE_KEY = 'mockCategories';

const getStoredCategories = (): Category[] => {
  if (!USE_MOCK_DATA) return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with default categories from mockData
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCategories));
  return mockCategories;
};

const saveCategories = (categories: Category[]): void => {
  if (USE_MOCK_DATA) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }
};

export const categoryService = {
  getAll: async (isActive?: boolean): Promise<Category[]> => {
    if (USE_MOCK_DATA) {
      const categories = getStoredCategories();
      return Promise.resolve(categories.filter(c => isActive === undefined || c.isActive === isActive));
    }
    const params = isActive !== undefined ? `?isActive=${isActive}` : '';
    const response = await api.get(`/categories${params}`);
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    if (USE_MOCK_DATA) {
      const categories = getStoredCategories();
      const category = categories.find(c => c.id === id);
      return Promise.resolve(category || categories[0]);
    }
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data: Partial<Category>): Promise<Category> => {
    if (USE_MOCK_DATA) {
      const categories = getStoredCategories();
      const newCategory: Category = {
        id: String(Date.now()),
        name: data.name || '',
        description: data.description || '',
        isActive: data.isActive !== undefined ? data.isActive : true,
        videoCount: 0,
        order: categories.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      categories.push(newCategory);
      saveCategories(categories);
      return Promise.resolve(newCategory);
    }
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    if (USE_MOCK_DATA) {
      const categories = getStoredCategories();
      const index = categories.findIndex(c => c.id === id);
      if (index !== -1) {
        categories[index] = {
          ...categories[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        saveCategories(categories);
        return Promise.resolve(categories[index]);
      }
      return Promise.reject(new Error('Category not found'));
    }
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      const categories = getStoredCategories();
      const index = categories.findIndex(c => c.id === id);
      if (index !== -1) {
        categories.splice(index, 1);
        saveCategories(categories);
      }
      return Promise.resolve();
    }
    await api.delete(`/categories/${id}`);
  },
};
