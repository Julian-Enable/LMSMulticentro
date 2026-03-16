import prisma from '../config/database';
import { NotFoundError, BadRequestError } from '../errors/errors';

export class VideoService {
  static async getVideos(categoryId?: string, isActive?: boolean) {
    return await prisma.video.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        category: true,
        topics: {
          where: { isActive: true },
          select: { 
            id: true, 
            code: true, 
            title: true, 
            timestamp: true,
            views: true,
            tags: {
              include: {
                tag: true
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });
  }

  static async getVideoById(id: string) {
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        category: true,
        topics: {
          where: { isActive: true },
          include: {
            tags: {
              include: {
                tag: true
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!video) {
      throw new NotFoundError('Video');
    }

    return video;
  }

  static async createVideo(data: any) {
    const durationValue = data.duration ? (typeof data.duration === 'string' ? parseFloat(data.duration) : data.duration) : null;

    return await prisma.video.create({
      data: {
        title: data.title,
        description: data.description,
        externalId: data.externalId,
        platform: data.platform,
        duration: durationValue,
        thumbnailUrl: data.thumbnailUrl,
        categoryId: data.categoryId,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true
      },
      include: {
        category: true
      }
    });
  }

  static async updateVideo(id: string, data: any) {
    const exists = await prisma.video.findUnique({ where: { id } });
    if (!exists) throw new NotFoundError('Video');

    const durationValue = data.duration !== undefined 
      ? (data.duration === '' || data.duration === null ? null : (typeof data.duration === 'string' ? parseFloat(data.duration) : data.duration))
      : undefined;

    return await prisma.video.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.externalId && { externalId: data.externalId }),
        ...(data.platform && { platform: data.platform }),
        ...(data.duration !== undefined && { duration: durationValue }),
        ...(data.thumbnailUrl !== undefined && { thumbnailUrl: data.thumbnailUrl }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.isActive !== undefined && { isActive: data.isActive })
      },
      include: {
        category: true
      }
    });
  }

  static async deleteVideo(id: string) {
    const exists = await prisma.video.findUnique({ where: { id } });
    if (!exists) throw new NotFoundError('Video');

    await prisma.video.update({
      where: { id },
      data: { isActive: false }
    });
  }

  static async createVideoBundle(data: any) {
    const durationValue = data.duration ? (typeof data.duration === 'string' ? parseFloat(data.duration) : data.duration) : null;

    return await prisma.$transaction(async (tx) => {
      const video = await tx.video.create({
        data: {
          title: data.title,
          description: data.description,
          externalId: data.externalId,
          platform: data.platform,
          duration: durationValue,
          thumbnailUrl: data.thumbnailUrl,
          categoryId: data.categoryId,
          order: data.order || 0,
          isActive: data.isActive !== undefined ? data.isActive : true
        }
      });

      if (data.topics && Array.isArray(data.topics) && data.topics.length > 0) {
        const allTags = new Set<string>();
        data.topics.forEach((topic: any) => {
          if (topic.tags && Array.isArray(topic.tags)) {
            topic.tags.forEach((t: string) => allTags.add(t.trim().toLowerCase()));
          }
        });

        const tagsMap = new Map<string, string>();
        for (const tagName of allTags) {
          const tag = await tx.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName }
          });
          tagsMap.set(tagName, tag.id);
        }

        for (const [index, topicData] of data.topics.entries()) {
          const topicDuration = topicData.duration ? (typeof topicData.duration === 'string' ? parseFloat(topicData.duration) : topicData.duration) : null;
          
          await tx.topic.create({
             data: {
               code: topicData.code || `${index + 1}.0`,
               title: topicData.title,
               description: topicData.description,
               videoId: video.id,
               timestamp: topicData.timestamp || 0,
               duration: topicDuration,
               order: topicData.order || index,
               isActive: topicData.isActive !== undefined ? topicData.isActive : true,
               ...(topicData.tags && topicData.tags.length > 0 && {
                 tags: {
                   create: topicData.tags.map((tagName: string) => ({
                     tag: {
                       connect: { id: tagsMap.get(tagName.trim().toLowerCase()) }
                     }
                   }))
                 }
               })
             }
          });
        }
      }

      return await tx.video.findUnique({
        where: { id: video.id },
        include: {
          topics: {
            include: {
               tags: {
                 include: { tag: true }
               }
            }
          }
        }
      });
    });
  }
}
