import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/user.service';

export const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => ['users', id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: () => userService.getAll(),
  });
}
