import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateUserRole() {
  try {
    const username = 'admin';

    // Get ADMIN role
    const adminRole = await prisma.role.findFirst({
      where: { code: 'ADMIN' }
    });

    if (!adminRole) {
      console.log('❌ ADMIN role not found in database.');
      process.exit(1);
    }

    const user = await prisma.user.update({
      where: { username },
      data: { roleId: adminRole.id },
      include: { role: true }
    });

    console.log('✅ User role updated successfully!');
    console.log('📧 Username:', user.username);
    console.log('👤 Role:', user.role.name);
  } catch (error) {
    console.error('❌ Error updating user role:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRole();
