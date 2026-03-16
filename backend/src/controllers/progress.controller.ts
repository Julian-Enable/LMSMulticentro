import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ProgressService } from '../services/progress.service';

export const getCategoryProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { categoryId } = req.params;
    const progress = await ProgressService.getCategoryProgress(req.user.id, categoryId);
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

export const markTopicComplete = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const progress = await ProgressService.markTopicComplete(req.user.id, req.body.topicId);
    res.json(progress);
  } catch (error) {
    next(error);
  }
};

export const unmarkTopicComplete = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    await ProgressService.unmarkTopicComplete(req.user.id, req.body.topicId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getAllProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const progress = await ProgressService.getAllProgress(req.user.id);
    res.json(progress);
  } catch (error) {
    next(error);
  }
};
