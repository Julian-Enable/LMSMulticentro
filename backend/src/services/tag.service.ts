import prisma from '../config/database';
import { NotFoundError } from '../errors/errors';

export class TagService {
  static async getTags() {
    const tags = await prisma.tag.findMany({
      include: {
        topics: {
          select: { topicId: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    return tags.map((tag: any) => ({
      ...tag,
      topicCount: tag.topics.length,
      topics: undefined
    }));
  }

  static async getTagById(id: string) {
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        topics: {
          include: {
            topic: {
              include: {
                video: {
                  include: {
                    category: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!tag) throw new NotFoundError('Tag');
    return tag;
  }

  static async createTag(name: string) {
    return await prisma.tag.create({
      data: { name: name.trim().toLowerCase() }
    });
  }

  static async updateTag(id: string, name: string) {
    const tagExists = await prisma.tag.findUnique({ where: { id } });
    if (!tagExists) throw new NotFoundError('Tag');

    return await prisma.tag.update({
      where: { id },
      data: { name: name.trim().toLowerCase() }
    });
  }

  static async deleteTag(id: string) {
    const tagExists = await prisma.tag.findUnique({ where: { id } });
    if (!tagExists) throw new NotFoundError('Tag');

    await prisma.tag.delete({
      where: { id }
    });
  }
}
