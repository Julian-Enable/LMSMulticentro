import prisma from '../config/database';
import { NotFoundError, BadRequestError, ConflictError } from '../errors/errors';

export class RoleService {
  static async getRoles(isActive?: boolean) {
    return await prisma.role.findMany({
      where: isActive !== undefined ? { isActive } : {},
      orderBy: [
        { isSystem: 'desc' },
        { name: 'asc' }
      ]
    });
  }

  static async getRoleById(id: string) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            categoryRoles: true
          }
        }
      }
    });

    if (!role) throw new NotFoundError('Rol');
    return role;
  }

  static async createRole(data: any) {
    const code = data.code.toUpperCase();
    
    const existing = await prisma.role.findUnique({
      where: { code }
    });

    if (existing) {
      throw new ConflictError('Role code already exists');
    }

    return await prisma.role.create({
      data: {
        code,
        name: data.name,
        description: data.description,
        color: data.color || '#3B82F6',
        isActive: data.isActive !== undefined ? data.isActive : true,
        isSystem: false
      }
    });
  }

  static async updateRole(id: string, data: any) {
    const code = data.code ? data.code.toUpperCase() : undefined;
    
    const existing = await prisma.role.findUnique({
      where: { id }
    });

    if (!existing) {
      throw new NotFoundError('Rol');
    }

    if (existing.isSystem && code && code !== existing.code) {
      throw new BadRequestError('Cannot change code of system role');
    }

    return await prisma.role.update({
      where: { id },
      data: {
        ...(code && { code }),
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.color && { color: data.color }),
        ...(data.isActive !== undefined && { isActive: data.isActive })
      }
    });
  }

  static async deleteRole(id: string) {
    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });

    if (!role) throw new NotFoundError('Rol');
    if (role.isSystem) throw new BadRequestError('Cannot delete system role');
    if (role._count.users > 0) throw new ConflictError(`Cannot delete role with ${role._count.users} assigned users. Reassign users first.`);

    await prisma.role.delete({
      where: { id }
    });
  }
}
