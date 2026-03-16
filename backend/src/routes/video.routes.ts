import { Router } from 'express';
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  createVideoBundle
} from '../controllers/video.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { createVideoSchema, updateVideoSchema, videoIdSchema } from '../validators/video.validator';

const router = Router();

// Protected routes - require authentication
router.get('/', authenticate, getVideos);
router.get('/:id', authenticate, validateRequest(videoIdSchema), getVideoById);

// Admin only routes
router.post('/bundle', authenticate, createVideoBundle);
router.post('/', authenticate, validateRequest(createVideoSchema), createVideo);
router.put('/:id', authenticate, validateRequest(updateVideoSchema), updateVideo);
router.delete('/:id', authenticate, validateRequest(videoIdSchema), deleteVideo);

export default router;
