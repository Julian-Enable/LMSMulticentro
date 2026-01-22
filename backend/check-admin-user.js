const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdminUser() {
  try {
    const adminUser = await prisma.user.findFirst({
      where: {
        username: 'admin'
      },
      include: {
        role: true
      }
    });

    console.log('Admin user:', JSON.stringify(adminUser, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdminUser();
