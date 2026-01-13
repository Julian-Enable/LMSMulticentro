import api from './api';
import { SearchResult } from '../types';

export const searchService = {
  search: async (query: string, categoryId?: string, page = 1, limit = 20): Promise<SearchResult> => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });

    if (categoryId) {
      params.append('category', categoryId);
    }

    const response = await api.get(`/search?${params.toString()}`);
    return response.data;
  },
};
