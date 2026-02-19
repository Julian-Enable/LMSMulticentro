import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

// GET /api/progress/:categoryId — devuelve los topicIds completados por el usuario
export const getCategoryProgress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { categoryId } = req.params;

    const progressRecords = await prisma.userProgress.findMany({
      where: {
        userId: req.user.id,
        topic: {
          video: {
            categoryId: String(categoryId)
          }
        }
      },
      select: { topicId: true, completedAt: true }
    });

    res.json({ completedTopics: progressRecords.map((p: { topicId: string }) => p.topicId) });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/progress/complete — marca un tema como completado
export const markTopicComplete = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { topicId } = req.body;
    if (!topicId) return res.status(400).json({ message: 'topicId is required' });

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_topicId: { userId: req.user.id, topicId }
      },
      update: { completedAt: new Date() },
      create: { userId: req.user.id, topicId }
    });

    res.json(progress);
  } catch (error) {
    console.error('Mark complete error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/progress/complete — desmarca un tema
export const unmarkTopicComplete = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { topicId } = req.body;
    if (!topicId) return res.status(400).json({ message: 'topicId is required' });

    await prisma.userProgress.deleteMany({
      where: { userId: req.user.id, topicId }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Unmark complete error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/progress/all — devuelve todos los topicIds completados por el usuario (para HomePage)
export const getAllProgress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const progressRecords = await prisma.userProgress.findMany({
      where: { userId: req.user.id },
      select: {
        topicId: true,
        completedAt: true,
        topic: {
          select: {
            id: true,
            title: true,
            code: true,
            video: {
              select: {
                id: true,
                title: true,
                category: { select: { id: true, name: true } }
              }
            }
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    });

    res.json({ completedTopics: progressRecords });
  } catch (error) {
    console.error('Get all progress error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
