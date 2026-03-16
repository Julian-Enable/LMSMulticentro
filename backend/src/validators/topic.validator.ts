import { z } from 'zod';

export const createTopicSchema = z.object({
  body: z.object({
    code: z.string().min(1, "El código es requerido").max(20),
    title: z.string().min(2, "El título es requerido").max(100),
    description: z.string().max(1000).optional().nullable(),
    videoId: z.string().uuid("ID de video inválido"),
    timestamp: z.union([z.number(), z.string()]),
    duration: z.union([z.number(), z.string()]).optional().nullable(),
    order: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
    tags: z.array(z.string()).optional()
  })
});

export const updateTopicSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID de tema inválido")
  }),
  body: z.object({
    code: z.string().min(1).max(20).optional(),
    title: z.string().min(2).max(100).optional(),
    description: z.string().max(1000).optional().nullable(),
    videoId: z.string().uuid().optional(),
    timestamp: z.union([z.number(), z.string()]).optional(),
    duration: z.union([z.number(), z.string()]).optional().nullable(),
    order: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
    tags: z.array(z.string()).optional()
  })
});

export const topicIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID de tema inválido")
  })
});
