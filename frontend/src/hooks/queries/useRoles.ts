import { useQuery } from '@tanstack/react-query';
import { roleService } from '../../services/role.service';

export const roleKeys = {
  all: ['roles'] as const,
  detail: (id: string) => ['roles', id] as const,
};

export function useRoles(isActive?: boolean) {
  return useQuery({
    queryKey: roleKeys.all,
    queryFn: () => roleService.getAll(isActive),
  });
}
