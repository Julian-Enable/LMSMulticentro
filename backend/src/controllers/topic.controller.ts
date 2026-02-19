import { Request, Response } from 'express';
import prisma from '../config/database';

export const getTopics = async (req: Request, res: Response) => {
  try {
    const { videoId, categoryId, isActive } = req.query;

    const topics = await prisma.topic.findMany({
      where: {
        ...(videoId && { videoId: videoId as string }),
        ...(isActive !== undefined && { isActive: isActive === 'true' }),
        ...(categoryId && {
          video: {
            categoryId: categoryId as string
          }
        })
      },
      include: {
        video: {
          include: {
            category: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        quizzes: {
          where: { isActive: true },
          select: { id: true }
        }
      },
      orderBy: { code: 'asc' }
    });

    res.json(topics);
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTopicById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const topic = await prisma.topic.findUnique({
      where: { id: String(id) },
      include: {
        video: {
          include: {
            category: true,
            topics: {
              where: { isActive: true },
              orderBy: { order: 'asc' },
              select: { id: true, title: true, order: true, duration: true, timestamp: true }
            }
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        quizzes: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    res.json(topic);
  } catch (error) {
    console.error('Get topic error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createTopic = async (req: Request, res: Response) => {
  try {
    const { code, title, description, videoId, timestamp, duration, order, isActive, tagIds } = req.body;

    if (!code || !title || !videoId || timestamp === undefined) {
      return res.status(400).json({ message: 'Code, title, videoId, and timestamp are required' });
    }

    const topic = await prisma.topic.create({
      data: {
        code,
        title,
        description,
        videoId,
        timestamp,
        duration,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        ...(tagIds && tagIds.length > 0 && {
          tags: {
            create: tagIds.map((tagId: string) => ({
              tag: {
                connect: { id: tagId }
              }
            }))
          }
        })
      },
      include: {
        video: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    res.status(201).json(topic);
  } catch (error) {
    console.error('Create topic error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, title, description, videoId, timestamp, duration, order, isActive, tagIds } = req.body;

    // Si se actualizan los tags, primero eliminar los existentes
    if (tagIds !== undefined) {
      await prisma.topicTag.deleteMany({
        where: { topicId: String(id) }
      });
    }

    const topic = await prisma.topic.update({
      where: { id: String(id) },
      data: {
        ...(code && { code }),
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(videoId && { videoId }),
        ...(timestamp !== undefined && { timestamp }),
        ...(duration !== undefined && { duration }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
        ...(tagIds && {
          tags: {
            create: tagIds.map((tagId: string) => ({
              tag: {
                connect: { id: tagId }
              }
            }))
          }
        })
      },
      include: {
        video: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    res.json(topic);
  } catch (error) {
    console.error('Update topic error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.topic.delete({
      where: { id: String(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete topic error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Navegación de temas
export const getNextTopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const currentTopic = await prisma.topic.findUnique({
      where: { id: String(id) },
      select: { videoId: true, order: true }
    });

    if (!currentTopic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const nextTopic = await prisma.topic.findFirst({
      where: {
        videoId: currentTopic.videoId,
        order: { gt: currentTopic.order },
        isActive: true
      },
      include: {
        video: true,
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    if (!nextTopic) {
      return res.status(404).json({ message: 'No next topic found' });
    }

    res.json(nextTopic);
  } catch (error) {
    console.error('Get next topic error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPreviousTopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const currentTopic = await prisma.topic.findUnique({
      where: { id: String(id) },
      select: { videoId: true, order: true }
    });

    if (!currentTopic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    const previousTopic = await prisma.topic.findFirst({
      where: {
        videoId: currentTopic.videoId,
        order: { lt: currentTopic.order },
        isActive: true
      },
      include: {
        video: true,
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: { order: 'desc' }
    });

    if (!previousTopic) {
      return res.status(404).json({ message: 'No previous topic found' });
    }

    res.json(previousTopic);
  } catch (error) {
    console.error('Get previous topic error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const incrementTopicViews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const topic = await prisma.topic.update({
      where: { id: String(id) },
      data: {
        views: {
          increment: 1
        }
      },
      select: {
        id: true,
        views: true
      }
    });

    res.json(topic);
  } catch (error) {
    console.error('Increment topic views error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
