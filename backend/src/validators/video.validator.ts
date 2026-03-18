import { z } from 'zod';

const topicSchema = z.object({
  code: z.string().min(1, "El código es requerido").max(20),
  title: z.string().min(2, "El título es requerido").max(100),
  description: z.string().max(1000).optional().nullable(),
  timestamp: z.number().int().nonnegative("El timestamp debe ser mayor o igual a 0"),
  duration: z.number().int().nonnegative().optional().nullable(),
  order: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional()
});

export const createVideoSchema = z.object({
  body: z.object({
    title: z.string().min(2, "El título es requerido").max(200),
    description: z.string().max(2000).optional().nullable(),
    externalId: z.string().min(1, "El ID del video es requerido"),
    platform: z.enum(['YOUTUBE', 'GOOGLE_DRIVE', 'VIMEO']),
    duration: z.union([z.number(), z.string()]).optional().nullable(),
    thumbnailUrl: z.string().url().optional().nullable(),
    categoryId: z.string(),
    order: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
    topics: z.array(topicSchema).optional()
  })
});

export const updateVideoSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().max(2000).optional().nullable(),
    externalId: z.string().min(1).optional(),
    platform: z.enum(['YOUTUBE', 'GOOGLE_DRIVE', 'VIMEO']).optional(),
    duration: z.union([z.number(), z.string()]).optional().nullable(),
    thumbnailUrl: z.string().url().optional().nullable(),
    categoryId: z.string().optional(),
    order: z.number().int().nonnegative().optional(),
    isActive: z.boolean().optional(),
  })
});

export const videoIdSchema = z.object({
  params: z.object({
    id: z.string()
  })
});
