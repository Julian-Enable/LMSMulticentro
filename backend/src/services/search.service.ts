import prisma from '../config/database';
import { BadRequestError } from '../errors/errors';

export class SearchService {
  static async searchContent(q: string, category?: string, page: number = 1, limit: number = 20) {
    if (!q || typeof q !== 'string') throw new BadRequestError('Query parameter "q" is required');

    const skip = (page - 1) * limit;
    const searchTerms = q.toLowerCase().split(' ').filter(term => term.length > 0);

    const whereClause: any = {
      isActive: true,
      OR: searchTerms.flatMap(term => [
        { code: { contains: term, mode: 'insensitive' } },
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
        {
          tags: {
            some: {
              tag: {
                name: { contains: term, mode: 'insensitive' }
              }
            }
          }
        }
      ])
    };

    if (category) {
      whereClause.video = {
        categoryId: category
      };
    }

    const [topics, total] = await Promise.all([
      prisma.topic.findMany({
        where: whereClause,
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
        orderBy: { code: 'asc' },
        skip,
        take: limit
      }),
      prisma.topic.count({ where: whereClause })
    ]);

    const topicsWithRelevance = topics.map((topic: any) => {
      let relevance = 0;
      const searchableText = [
        topic.code,
        topic.title,
        topic.description || '',
        ...topic.tags.map((t: any) => t.tag.name)
      ].join(' ').toLowerCase();

      searchTerms.forEach((term: string) => {
        if (searchableText.includes(term)) {
          relevance++;
        }
      });

      return { ...topic, relevance };
    });

    topicsWithRelevance.sort((a: any, b: any) => b.relevance - a.relevance);

    return {
      results: topicsWithRelevance,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      query: q
    };
  }
}
