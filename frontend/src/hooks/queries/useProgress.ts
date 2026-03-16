import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { progressService } from '../../services/progress.service';
import toast from 'react-hot-toast';

export const progressKeys = {
  all: ['progress'] as const,
  byCategory: (categoryId: string) => ['progress', categoryId] as const,
};

export function useProgress(categoryId: string) {
  return useQuery({
    queryKey: progressKeys.byCategory(categoryId),
    queryFn: () => progressService.getCategoryProgress(categoryId),
    enabled: !!categoryId,
  });
}

export function useAllProgress() {
  return useQuery({
    queryKey: progressKeys.all,
    queryFn: () => progressService.getAllProgress(),
  });
}

export function useMarkComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topicId: string) => progressService.markComplete(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
      toast.success('Tema marcado como completado');
    },
    onError: () => {
      toast.error('Error al marcar como completado');
    },
  });
}

export function useUnmarkComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topicId: string) => progressService.unmarkComplete(topicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
    },
  });
}
