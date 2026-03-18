import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "El nombre de la categoría debe tener al menos 2 caracteres").max(100),
    description: z.string().max(500).optional().nullable(),
    order: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
    allowedRoles: z.array(z.string()).optional()
  })
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(500).optional().nullable(),
    order: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
    allowedRoles: z.array(z.string()).optional()
  })
});

export const categoryIdSchema = z.object({
  params: z.object({
    id: z.string()
  })
});
