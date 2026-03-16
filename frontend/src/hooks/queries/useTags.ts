import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';

export const tagKeys = {
  all: ['tags'] as const,
  detail: (id: string) => ['tags', id] as const,
};

export function useTags() {
  return useQuery({
    queryKey: tagKeys.all,
    queryFn: async () => {
      const { data } = await api.get('/tags');
      return data;
    },
  });
}
