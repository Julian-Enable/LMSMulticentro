import { useQuery } from '@tanstack/react-query';
import { topicService } from '../../services/topic.service';

export const topicKeys = {
  all: ['topics'] as const,
  byVideo: (videoId: string) => ['topics', 'video', videoId] as const,
  byCategory: (categoryId: string) => ['topics', 'category', categoryId] as const,
  detail: (id: string) => ['topics', id] as const,
};

export function useTopics(videoId?: string, categoryId?: string) {
  return useQuery({
    queryKey: videoId
      ? topicKeys.byVideo(videoId)
      : categoryId
        ? topicKeys.byCategory(categoryId)
        : topicKeys.all,
    queryFn: () => topicService.getAll(videoId, categoryId),
  });
}

export function useTopic(id: string) {
  return useQuery({
    queryKey: topicKeys.detail(id),
    queryFn: () => topicService.getById(id),
    enabled: !!id,
  });
}
