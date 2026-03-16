import prisma from '../config/database';
import { NotFoundError } from '../errors/errors';

export class CategoryService {
  static async getCategories(isActive?: boolean, admin?: boolean, userRoleId?: string) {
    const categories = await prisma.category.findMany({
      where: isActive !== undefined ? { isActive } : {},
      include: {
        videos: {
          select: { 
            id: true,
            isActive: true,
            duration: true,
            topics: {
              where: { isActive: true },
              select: { 
                id: true,
                duration: true
              }
            }
          }
        },
        categoryRoles: {
          include: {
            role: true
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    let userRole = null;
    if (userRoleId) {
      userRole = await prisma.role.findUnique({
        where: { id: userRoleId }
      });
    }

    return categories.map(cat => {
      const activeVideos = cat.videos.filter(v => v.isActive);
      return {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        order: cat.order,
        isActive: cat.isActive,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
        videos: activeVideos,
        videoCount: activeVideos.length,
        allowedRoles: cat.categoryRoles.map(cr => cr.role.code),
        categoryRoles: cat.categoryRoles
      };
    }).filter(cat => {
      if (admin) return true;
      if (userRole?.code === 'ADMIN') return true;
      if (cat.categoryRoles.length === 0) return true;
      return cat.categoryRoles.some(cr => cr.roleId === userRoleId);
    });
  }

  static async getCategoryById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        videos: {
          where: { isActive: true },
          include: {
            topics: {
              where: { isActive: true }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!category) {
      throw new NotFoundError('Categoría');
    }

    return category;
  }

  static async createCategory(data: any) {
    return await prisma.category.create({
      data: {
        name: data.name,
        description: data.description,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
        ...(data.allowedRoles && data.allowedRoles.length > 0 && {
          categoryRoles: {
            create: data.allowedRoles.map((roleId: string) => ({
              roleId
            }))
          }
        })
      },
      include: {
        categoryRoles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  static async updateCategory(id: string, data: any) {
    const exists = await prisma.category.findUnique({ where: { id } });
    if (!exists) throw new NotFoundError('Categoría');

    await prisma.category.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.isActive !== undefined && { isActive: data.isActive })
      }
    });

    if (data.allowedRoles !== undefined) {
      await prisma.categoryRole.deleteMany({
        where: { categoryId: id }
      });

      if (data.allowedRoles.length > 0) {
        await prisma.categoryRole.createMany({
          data: data.allowedRoles.map((roleId: string) => ({
            categoryId: id,
            roleId
          }))
        });
      }
    }

    return await prisma.category.findUnique({
      where: { id },
      include: {
        categoryRoles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  static async deleteCategory(id: string) {
    const exists = await prisma.category.findUnique({ where: { id } });
    if (!exists) throw new NotFoundError('Categoría');

    await prisma.category.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
