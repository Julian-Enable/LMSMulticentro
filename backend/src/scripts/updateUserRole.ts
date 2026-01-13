import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUserRole() {
  try {
    const username = 'admin';

    const user = await prisma.user.update({
      where: { username },
      data: { role: 'ADMIN' }
    });

    console.log('✅ User role updated successfully!');
    console.log('📧 Username:', user.username);
    console.log('👤 Role:', user.role);
  } catch (error) {
    console.error('❌ Error updating user role:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRole();
