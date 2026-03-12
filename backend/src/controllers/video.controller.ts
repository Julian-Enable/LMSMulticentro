import { Request, Response } from 'express';
import prisma from '../config/database';

export const getVideos = async (req: Request, res: Response) => {
  try {
    const { categoryId, isActive } = req.query;

    const videos = await prisma.video.findMany({
      where: {
        ...(categoryId && { categoryId: categoryId as string }),
        ...(isActive !== undefined && { isActive: isActive === 'true' })
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

    res.json(videos);
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getVideoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const video = await prisma.video.findUnique({
      where: { id: String(id) },
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
      return res.status(404).json({ message: 'Video not found' });
    }

    res.json(video);
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createVideo = async (req: Request, res: Response) => {
  try {
    const { title, description, externalId, platform, duration, thumbnailUrl, categoryId, order, isActive } = req.body;

    if (!title || !externalId || !platform || !categoryId) {
      return res.status(400).json({ message: 'Title, externalId, platform, and categoryId are required' });
    }

    // Convert duration to number if it's a string
    const durationValue = duration ? (typeof duration === 'string' ? parseFloat(duration) : duration) : null;

    const video = await prisma.video.create({
      data: {
        title,
        description,
        externalId,
        platform,
        duration: durationValue,
        thumbnailUrl,
        categoryId,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        category: true
      }
    });

    res.status(201).json(video);
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, externalId, platform, duration, thumbnailUrl, categoryId, order, isActive } = req.body;

    // Convert duration to number if it's a string
    const durationValue = duration !== undefined 
      ? (duration === '' || duration === null ? null : (typeof duration === 'string' ? parseFloat(duration) : duration))
      : undefined;

    const video = await prisma.video.update({
      where: { id: String(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(externalId && { externalId }),
        ...(platform && { platform }),
        ...(duration !== undefined && { duration: durationValue }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(categoryId && { categoryId }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        category: true
      }
    });

    res.json(video);
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteVideo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.video.delete({
      where: { id: String(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createVideoBundle = async (req: Request, res: Response) => {
  try {
    const { 
      title, description, externalId, platform, duration, thumbnailUrl, categoryId, order, isActive,
      topics // Array of topics to create: { code, title, timestamp, duration, tags: [string] }
    } = req.body;

    if (!title || !externalId || !platform || !categoryId) {
      return res.status(400).json({ message: 'Title, externalId, platform, and categoryId are required' });
    }

    const durationValue = duration ? (typeof duration === 'string' ? parseFloat(duration) : duration) : null;

    // Use Prisma Transaction to ensure either everything is created or nothing is (Atomicity)
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the video
      const video = await tx.video.create({
        data: {
          title,
          description,
          externalId,
          platform,
          duration: durationValue,
          thumbnailUrl,
          categoryId,
          order: order || 0,
          isActive: isActive !== undefined ? isActive : true
        }
      });

      // 2. Process tags globally across all topics to create missing tags first
      if (topics && Array.isArray(topics) && topics.length > 0) {
        // Collect all unique tag names
        const allTags = new Set<string>();
        topics.forEach((topic: any) => {
          if (topic.tags && Array.isArray(topic.tags)) {
            topic.tags.forEach((t: string) => allTags.add(t));
          }
        });

        const tagsMap = new Map<string, string>(); // name -> tag id

        // For each tag, upsert it
        for (const tagName of allTags) {
          const tag = await tx.tag.upsert({
            where: { name: tagName },
            update: {}, // Do nothing if it exists
            create: { name: tagName }
          });
          tagsMap.set(tagName, tag.id);
        }

        // 3. Create topics and link tags
        for (const [index, topicData] of topics.entries()) {
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
               // Link created tags
               ...(topicData.tags && topicData.tags.length > 0 && {
                 tags: {
                   create: topicData.tags.map((tagName: string) => ({
                     tag: {
                       connect: { id: tagsMap.get(tagName) }
                     }
                   }))
                 }
               })
             }
          });
        }
      }

      // Return the created video structure including topics and tags
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

    res.status(201).json(result);
  } catch (error) {
    console.error('Create video bundle error:', error);
    res.status(500).json({ message: 'Internal server error while creating bundle' });
  }
};

