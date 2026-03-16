import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database';

export class TokenService {
  static generateAccessToken(payload: any) {
    return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
  }

  static async generateRefreshToken(userId: string) {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });

    return token;
  }

  static async validateRefreshToken(token: string) {
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!storedToken || storedToken.revoked) {
      throw new Error('Token inválido');
    }

    if (new Date() > storedToken.expiresAt) {
      throw new Error('Token expirado');
    }

    return storedToken.user;
  }

  static async revokeRefreshToken(token: string) {
    await prisma.refreshToken.update({
      where: { token },
      data: { revoked: true },
    });
  }

  static async revokeAllUserTokens(userId: string) {
    await prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }
}
