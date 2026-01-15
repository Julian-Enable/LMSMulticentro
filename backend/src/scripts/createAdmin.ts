import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const username = process.argv[2] || 'admin';
    const password = process.argv[3] || 'admin123';
    const email = process.argv[4] || 'admin@multicentro.com';

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      console.log(`❌ User '${username}' already exists`);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get ADMIN role
    const adminRole = await prisma.role.findFirst({
      where: { code: 'ADMIN' }
    });

    if (!adminRole) {
      console.log('❌ ADMIN role not found in database. Please run migrations first.');
      process.exit(1);
    }

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        roleId: adminRole.id,
      },
      include: {
        role: true
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Username:', adminUser.username);
    console.log('👤 Role:', adminUser.role.name);
    console.log('🔑 Password:', password);
    console.log('⚠️  Please change the password after first login!');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
