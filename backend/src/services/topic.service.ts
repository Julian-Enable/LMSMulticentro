import prisma from '../config/database';
import { NotFoundError } from '../errors/errors';

export class TopicService {
  static async getTopics(videoId?: string, categoryId?: string, isActive?: boolean) {
    return await prisma.topic.findMany({
      where: {
        ...(videoId && { videoId }),
        ...(isActive !== undefined && { isActive }),
        ...(categoryId && {
          video: {
            categoryId
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
  }

  static async getTopicById(id: string) {
    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        video: {
          include: {
            category: {
              include: {
                videos: {
                  where: { isActive: true },
                  orderBy: { order: 'asc' },
                  select: {
                    id: true,
                    title: true,
                    order: true,
                    topics: {
                      where: { isActive: true },
                      orderBy: { order: 'asc' },
                      select: { id: true }
                    }
                  }
                }
              }
            },
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

    if (!topic) throw new NotFoundError('Tema');
    return topic;
  }

  static async createTopic(data: any) {
    return await prisma.topic.create({
      data: {
        code: data.code,
        title: data.title,
        description: data.description,
        videoId: data.videoId,
        timestamp: data.timestamp,
        duration: data.duration,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
        ...(data.tagIds && data.tagIds.length > 0 && {
          tags: {
            create: data.tagIds.map((tagId: string) => ({
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
  }

  static async updateTopic(id: string, data: any) {
    const exists = await prisma.topic.findUnique({ where: { id } });
    if (!exists) throw new NotFoundError('Tema');

    if (data.tagIds !== undefined) {
      await prisma.topicTag.deleteMany({
        where: { topicId: id }
      });
    }

    return await prisma.topic.update({
      where: { id },
      data: {
        ...(data.code && { code: data.code }),
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.videoId && { videoId: data.videoId }),
        ...(data.timestamp !== undefined && { timestamp: data.timestamp }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.tagIds && {
          tags: {
            create: data.tagIds.map((tagId: string) => ({
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
  }

  static async deleteTopic(id: string) {
    const exists = await prisma.topic.findUnique({ where: { id } });
    if (!exists) throw new NotFoundError('Tema');

    await prisma.topic.update({
      where: { id },
      data: { isActive: false }
    });
  }

  static async getNextTopic(id: string) {
    const currentTopic = await prisma.topic.findUnique({
      where: { id },
      select: { videoId: true, order: true }
    });

    if (!currentTopic) throw new NotFoundError('Tema actual');

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

    if (!nextTopic) throw new NotFoundError('Siguiente tema');

    return nextTopic;
  }

  static async getPreviousTopic(id: string) {
    const currentTopic = await prisma.topic.findUnique({
      where: { id },
      select: { videoId: true, order: true }
    });

    if (!currentTopic) throw new NotFoundError('Tema actual');

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

    if (!previousTopic) throw new NotFoundError('Tema anterior');

    return previousTopic;
  }

  static async incrementTopicViews(id: string) {
    return await prisma.topic.update({
      where: { id },
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
  }
}
