import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres").max(50, "El nombre de usuario no puede exceder 50 caracteres"),
    email: z.string().email("Formato de email inválido").optional().nullable(),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(100),
    roleId: z.string(),
    isActive: z.boolean().optional()
  })
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    username: z.string().min(3).max(50).optional(),
    email: z.string().email().optional().nullable().or(z.literal('')),
    password: z.string().min(6).max(100).optional(),
    roleId: z.string().optional(),
    isActive: z.boolean().optional()
  })
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string()
  })
});
