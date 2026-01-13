import { Router } from 'express';
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo
} from '../controllers/video.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getVideos);
router.get('/:id', getVideoById);

// Protected routes (Admin only)
router.post('/', authenticate, authorize('ADMIN'), createVideo);
router.put('/:id', authenticate, authorize('ADMIN'), updateVideo);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteVideo);

export default router;
