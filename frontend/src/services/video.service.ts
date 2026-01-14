import api from './api';
import { Video } from '../types';

export const videoService = {
  getAll: async (): Promise<Video[]> => {
    const response = await api.get('/videos');
    return response.data;
  },

  getById: async (id: string): Promise<Video> => {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },

  create: async (data: Partial<Video>): Promise<Video> => {
    const response = await api.post('/videos', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Video>): Promise<Video> => {
    const response = await api.put(`/videos/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/videos/${id}`);
  },
};
