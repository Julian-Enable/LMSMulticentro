import api from './api';

export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  isSystem: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    users: number;
    categoryRoles: number;
  };
}

export const roleService = {
  getAll: async (isActive?: boolean): Promise<Role[]> => {
    const params = isActive !== undefined ? `?isActive=${isActive}` : '';
    const res = await api.get(`/roles${params}`);
    return res.data;
  },

  getById: async (id: string): Promise<Role> => {
    const res = await api.get(`/roles/${id}`);
    return res.data;
  },

  create: async (data: Partial<Role>): Promise<Role> => {
    const res = await api.post('/roles', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Role>): Promise<Role> => {
    const res = await api.put(`/roles/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/roles/${id}`);
  }
};
