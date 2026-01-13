import api from './api';
import { Video } from '../types';
import { mockVideos } from '../data/mockData';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true';
const STORAGE_KEY = 'mockVideos';

const getStoredVideos = (): Video[] => {
  if (!USE_MOCK_DATA) return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with default videos from mockData
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockVideos));
  return mockVideos;
};

const saveVideos = (videos: Video[]): void => {
  if (USE_MOCK_DATA) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  }
};

export const videoService = {
  getAll: async (): Promise<Video[]> => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(getStoredVideos());
    }
    const response = await api.get('/videos');
    return response.data;
  },

  getById: async (id: string): Promise<Video> => {
    if (USE_MOCK_DATA) {
      const videos = getStoredVideos();
      const video = videos.find(v => v.id === id);
      return Promise.resolve(video || videos[0]);
    }
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },

  create: async (data: Partial<Video>): Promise<Video> => {
    if (USE_MOCK_DATA) {
      const videos = getStoredVideos();
      const newVideo: Video = {
        id: String(Date.now()),
        title: data.title || '',
        description: data.description || '',
        externalId: data.externalId || '',
        platform: data.platform || 'YOUTUBE',
        categoryId: data.categoryId || '',
        duration: data.duration || 0,
        thumbnailUrl: data.thumbnailUrl || `https://picsum.photos/seed/${Date.now()}/400/225`,
        isActive: data.isActive !== undefined ? data.isActive : true,
        order: videos.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      videos.push(newVideo);
      saveVideos(videos);
      return Promise.resolve(newVideo);
    }
    const response = await api.post('/videos', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Video>): Promise<Video> => {
    if (USE_MOCK_DATA) {
      const videos = getStoredVideos();
      const index = videos.findIndex(v => v.id === id);
      if (index !== -1) {
        videos[index] = {
          ...videos[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        saveVideos(videos);
        return Promise.resolve(videos[index]);
      }
      return Promise.reject(new Error('Video not found'));
    }
    const response = await api.put(`/videos/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK_DATA) {
      const videos = getStoredVideos();
      const index = videos.findIndex(v => v.id === id);
      if (index !== -1) {
        videos.splice(index, 1);
        saveVideos(videos);
      }
      return Promise.resolve();
    }
    await api.delete(`/videos/${id}`);
  },
};
