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

// Public routes
router.get('/', getVideos);
router.get('/:id', getVideoById);

// Protected routes (Admin only)
router.post('/', authenticate, createVideo);
router.put('/:id', authenticate, updateVideo);
router.delete('/:id', authenticate, deleteVideo);

export default router;
