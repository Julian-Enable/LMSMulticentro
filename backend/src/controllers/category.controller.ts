import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const { isActive, admin } = req.query;
    const userRoleId = req.user?.roleId;

    const categories = await prisma.category.findMany({
      where: isActive !== undefined ? { isActive: isActive === 'true' } : {},
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

    // Get user's role to check if ADMIN
    let userRole = null;
    if (userRoleId) {
      userRole = await prisma.role.findUnique({
        where: { id: userRoleId }
      });
    }

    // Filter categories by user role (unless user is ADMIN)
    const filteredCategories = categories.map(cat => {
      const activeVideos = cat.videos.filter(v => v.isActive);
      return {
        id: cat.id,
        name: cat.name,
        description: cat.description,
        order: cat.order,
        isActive: cat.isActive,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
        videos: activeVideos, // Explicitly set filtered videos
        videoCount: activeVideos.length, // Add count for convenience
        allowedRoles: cat.categoryRoles.map(cr => cr.role.code), // For backward compatibility
        categoryRoles: cat.categoryRoles
      };
    }).filter(cat => {
      // Skip filtering if admin mode is enabled
      if (admin === 'true') return true;
      // Filter by role access
      if (userRole?.code === 'ADMIN') return true;
      if (cat.categoryRoles.length === 0) return true; // No restrictions
      return cat.categoryRoles.some(cr => cr.roleId === userRoleId);
    });

    res.json(filteredCategories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCategoryById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: String(id) },
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
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, order, isActive, allowedRoles } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        ...(allowedRoles && allowedRoles.length > 0 && {
          categoryRoles: {
            create: allowedRoles.map((roleId: string) => ({
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

    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, order, isActive, allowedRoles } = req.body;

    // Update basic fields
    const category = await prisma.category.update({
      where: { id: String(id) },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive })
      }
    });

    // Update roles if provided
    if (allowedRoles !== undefined) {
      // Delete existing role assignments
      await prisma.categoryRole.deleteMany({
        where: { categoryId: String(id) }
      });

      // Create new role assignments
      if (allowedRoles.length > 0) {
        await prisma.categoryRole.createMany({
          data: allowedRoles.map((roleId: string) => ({
            categoryId: String(id),
            roleId
          }))
        });
      }
    }

    // Fetch updated category with roles
    const updatedCategory = await prisma.category.findUnique({
      where: { id: String(id) },
      include: {
        categoryRoles: {
          include: {
            role: true
          }
        }
      }
    });

    res.json(updatedCategory);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id: String(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
