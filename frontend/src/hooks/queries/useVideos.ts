import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export const videoKeys = {
  all: ['videos'] as const,
  byCategory: (categoryId: string) => ['videos', 'category', categoryId] as const,
  detail: (id: string) => ['videos', id] as const,
};

export function useVideos(categoryId?: string) {
  return useQuery({
    queryKey: categoryId ? videoKeys.byCategory(categoryId) : videoKeys.all,
    queryFn: async () => {
      const params = categoryId ? `?categoryId=${categoryId}` : '';
      const { data } = await api.get(`/videos${params}`);
      return data;
    },
  });
}

export function useVideo(id: string) {
  return useQuery({
    queryKey: videoKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`/videos/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
