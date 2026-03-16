import { useQuery } from '@tanstack/react-query';
import { searchService } from '../../services/search.service';

export const searchKeys = {
  query: (q: string, categoryId?: string) => ['search', q, categoryId] as const,
};

export function useSearch(query: string, categoryId?: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: searchKeys.query(query, categoryId),
    queryFn: () => searchService.search(query, categoryId, page, limit),
    enabled: query.length >= 2,
  });
}
