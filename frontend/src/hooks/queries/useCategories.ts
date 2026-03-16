import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../../services/category.service';

export const categoryKeys = {
  all: ['categories'] as const,
  featured: ['categories', 'featured'] as const,
  detail: (id: string) => ['categories', id] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => categoryService.getAll(),
  });
}

export function useFeaturedCategories() {
  return useQuery({
    queryKey: categoryKeys.featured,
    queryFn: () => categoryService.getAll(true),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  });
}
