import { useMutation, useQueryClient } from '@tanstack/react-query';
import { topicService } from '../../services/topic.service';
import { topicKeys } from '../queries/useTopics';
import { videoKeys } from '../queries/useVideos';
import toast from 'react-hot-toast';

export function useCreateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => topicService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.all });
      queryClient.invalidateQueries({ queryKey: videoKeys.all });
      toast.success('Tema creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear tema');
    },
  });
}

export function useUpdateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => topicService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.all });
      queryClient.invalidateQueries({ queryKey: videoKeys.all });
      toast.success('Tema actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar tema');
    },
  });
}

export function useDeleteTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => topicService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: topicKeys.all });
      queryClient.invalidateQueries({ queryKey: videoKeys.all });
      toast.success('Tema eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar tema');
    },
  });
}
