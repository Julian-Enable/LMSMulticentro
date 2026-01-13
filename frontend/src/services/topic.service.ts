import api from './api';
import { Topic } from '../types';

export const topicService = {
  getAll: async (videoId?: string, categoryId?: string, isActive?: boolean): Promise<Topic[]> => {
    const params = new URLSearchParams();
    if (videoId) params.append('videoId', videoId);
    if (categoryId) params.append('categoryId', categoryId);
    if (isActive !== undefined) params.append('isActive', isActive.toString());

    const queryString = params.toString();
    const response = await api.get(`/topics${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  getById: async (id: string): Promise<Topic> => {
    const response = await api.get(`/topics/${id}`);
    return response.data;
  },

  getNext: async (id: string): Promise<Topic> => {
    const response = await api.get(`/topics/${id}/next`);
    return response.data;
  },

  getPrevious: async (id: string): Promise<Topic> => {
    const response = await api.get(`/topics/${id}/previous`);
    return response.data;
  },

  create: async (data: Partial<Topic> & { tagIds?: string[] }): Promise<Topic> => {
    const response = await api.post('/topics', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Topic> & { tagIds?: string[] }): Promise<Topic> => {
    const response = await api.put(`/topics/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/topics/${id}`);
  },
};
