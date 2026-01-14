import { Router } from 'express';
import { fetchVideoInfo } from '../controllers/youtube.controller';

const router = Router();

router.get('/:videoId', fetchVideoInfo);

export default router;
