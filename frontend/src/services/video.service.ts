import api from './api';
import { Video } from '../types';
import { mockVideos } from '../data/mockData';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true';

export const videoService = {
  getAll: async (): Promise<Video[]> => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockVideos);
    }
    const response = await api.get('/videos');
    return response.data;
  },

  getById: async (id: string): Promise<Video> => {
    if (USE_MOCK_DATA) {
      const video = mockVideos.find(v => v.id === id);
      return Promise.resolve(video || mockVideos[0]);
    }
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },

  create: async (data: Partial<Video>): Promise<Video> => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ ...mockVideos[0], ...data, id: String(Date.now()) } as Video);
    }
    const response = await api.post('/videos', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Video>): Promise<Video> => {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ ...mockVideos[0], ...data, id } as Video);
    }
    const response = await api.put(`/videos/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      return Promise.resolve();
    }
    await api.delete(`/videos/${id}`);
  },
};
