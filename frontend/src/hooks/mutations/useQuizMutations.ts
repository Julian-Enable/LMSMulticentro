import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { quizKeys } from '../queries/useQuizzes';
import toast from 'react-hot-toast';

export function useCreateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { data: result } = await api.post('/quizzes', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.all });
      toast.success('Cuestionario creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear cuestionario');
    },
  });
}

export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: result } = await api.put(`/quizzes/${id}`, data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.all });
      toast.success('Cuestionario actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar cuestionario');
    },
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/quizzes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.all });
      toast.success('Cuestionario eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar cuestionario');
    },
  });
}
