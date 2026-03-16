import prisma from '../config/database';
import bcrypt from 'bcryptjs';
import { ConflictError, NotFoundError } from '../errors/errors';

export class UserService {
  static async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        roleId: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  static async createUser(data: any) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: data.username },
          { email: data.email },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictError('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        roleId: true,
        role: true,
        createdAt: true,
      },
    });
  }

  static async updateUser(id: string, data: any) {
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      throw new NotFoundError('User');
    }

    const updateData: any = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        roleId: true,
        role: true,
        createdAt: true,
      },
    });
  }

  static async deleteUser(id: string) {
    const userExists = await prisma.user.findUnique({ where: { id } });
    if (!userExists) {
      throw new NotFoundError('User');
    }

    await prisma.user.update({
      where: { id },
      data: { isActive: false }
    });
  }
}
