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
      const newVideo: Video = {
        id: String(Date.now()),
        title: data.title || '',
        description: data.description || '',
        externalId: data.externalId || '',
        url: data.url || '',
        platform: data.platform || 'YOUTUBE',
        categoryId: data.categoryId || '',
        duration: data.duration || 0,
        thumbnailUrl: data.thumbnailUrl || `https://picsum.photos/seed/${Date.now()}/400/225`,
        isActive: data.isActive !== undefined ? data.isActive : true,
        order: mockVideos.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockVideos.push(newVideo);
      return Promise.resolve(newVideo);
    }
    const response = await api.post('/videos', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Video>): Promise<Video> => {
    if (USE_MOCK_DATA) {
      const index = mockVideos.findIndex(v => v.id === id);
      if (index !== -1) {
        mockVideos[index] = {
          ...mockVideos[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        return Promise.resolve(mockVideos[index]);
      }
      return Promise.reject(new Error('Video not found'));
    }
    const response = await api.put(`/videos/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      const index = mockVideos.findIndex(v => v.id === id);
      if (index !== -1) {
        mockVideos.splice(index, 1);
      }
      return Promise.resolve();
    }
    await api.delete(`/videos/${id}`);
  },
};
