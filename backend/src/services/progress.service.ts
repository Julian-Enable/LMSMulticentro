import prisma from '../config/database';
import { BadRequestError } from '../errors/errors';

export class ProgressService {
  static async getCategoryProgress(userId: string, categoryId: string) {
    const progressRecords = await prisma.userProgress.findMany({
      where: {
        userId,
        topic: {
          video: {
            categoryId
          }
        }
      },
      select: { topicId: true, completedAt: true }
    });

    return { completedTopics: progressRecords.map((p: { topicId: string }) => p.topicId) };
  }

  static async markTopicComplete(userId: string, topicId: string) {
    if (!topicId) throw new BadRequestError('topicId is required');

    return await prisma.userProgress.upsert({
      where: {
        userId_topicId: { userId, topicId }
      },
      update: { completedAt: new Date() },
      create: { userId, topicId }
    });
  }

  static async unmarkTopicComplete(userId: string, topicId: string) {
    if (!topicId) throw new BadRequestError('topicId is required');

    await prisma.userProgress.deleteMany({
      where: { userId, topicId }
    });
  }

  static async getAllProgress(userId: string) {
    const progressRecords = await prisma.userProgress.findMany({
      where: { userId },
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

    return { completedTopics: progressRecords };
  }
}
