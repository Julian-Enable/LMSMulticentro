import { Router } from 'express';
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo
} from '../controllers/video.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protected routes - require authentication
router.get('/', authenticate, getVideos);
router.get('/:id', authenticate, getVideoById);

// Admin only routes
router.post('/', authenticate, createVideo);
router.put('/:id', authenticate, updateVideo);
router.delete('/:id', authenticate, deleteVideo);

export default router;
