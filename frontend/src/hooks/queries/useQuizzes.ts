import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export const quizKeys = {
  all: ['quizzes'] as const,
  byTopic: (topicId: string) => ['quizzes', 'topic', topicId] as const,
  detail: (id: string) => ['quizzes', id] as const,
};

export function useQuizzes(topicId?: string) {
  return useQuery({
    queryKey: topicId ? quizKeys.byTopic(topicId) : quizKeys.all,
    queryFn: async () => {
      const params = topicId ? `?topicId=${topicId}` : '';
      const { data } = await api.get(`/quizzes${params}`);
      return data;
    },
  });
}
