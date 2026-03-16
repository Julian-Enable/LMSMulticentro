import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. Crear Roles
  console.log('  → Creando roles...');
  const adminRole = await prisma.role.upsert({
    where: { code: 'ADMIN' },
    update: {},
    create: {
      code: 'ADMIN',
      name: 'Administrador',
      description: 'Acceso completo al sistema',
      color: '#EF4444',
      isSystem: true,
    },
  });

  const cajeroRole = await prisma.role.upsert({
    where: { code: 'CAJERO' },
    update: {},
    create: {
      code: 'CAJERO',
      name: 'Cajero',
      description: 'Personal de caja',
      color: '#3B82F6',
    },
  });

  const ventasRole = await prisma.role.upsert({
    where: { code: 'VENTAS' },
    update: {},
    create: {
      code: 'VENTAS',
      name: 'Vendedor',
      description: 'Personal de ventas',
      color: '#10B981',
    },
  });

  const bodegaRole = await prisma.role.upsert({
    where: { code: 'BODEGA' },
    update: {},
    create: {
      code: 'BODEGA',
      name: 'Bodega',
      description: 'Personal de bodega e inventario',
      color: '#F59E0B',
    },
  });

  console.log(`    ✅ Roles: ${adminRole.name}, ${cajeroRole.name}, ${ventasRole.name}, ${bodegaRole.name}`);

  // 2. Crear usuario admin
  console.log('  → Creando usuario admin...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@multicentro.com',
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  // Crear usuarios de prueba
  const testPassword = await bcrypt.hash('test123', 10);
  await prisma.user.upsert({
    where: { username: 'cajero1' },
    update: {},
    create: {
      username: 'cajero1',
      email: 'cajero1@multicentro.com',
      password: testPassword,
      roleId: cajeroRole.id,
    },
  });

  await prisma.user.upsert({
    where: { username: 'vendedor1' },
    update: {},
    create: {
      username: 'vendedor1',
      email: 'vendedor1@multicentro.com',
      password: testPassword,
      roleId: ventasRole.id,
    },
  });
  console.log('    ✅ Usuarios creados (admin / cajero1 / vendedor1)');

  // 3. Crear Categorías
  console.log('  → Creando categorías...');
  const catVentas = await prisma.category.upsert({
    where: { id: 'seed-cat-ventas' },
    update: {},
    create: {
      id: 'seed-cat-ventas',
      name: 'Técnicas de Venta',
      description: 'Aprende las mejores prácticas y estrategias para cerrar ventas exitosas.',
      order: 1,
    },
  });

  const catCaja = await prisma.category.upsert({
    where: { id: 'seed-cat-caja' },
    update: {},
    create: {
      id: 'seed-cat-caja',
      name: 'Operaciones de Caja',
      description: 'Todo lo que necesitas saber sobre el manejo del punto de venta y arqueos.',
      order: 2,
    },
  });

  const catInventario = await prisma.category.upsert({
    where: { id: 'seed-cat-inventario' },
    update: {},
    create: {
      id: 'seed-cat-inventario',
      name: 'Gestión de Inventario',
      description: 'Controla entradas, salidas y organización del almacén.',
      order: 3,
    },
  });

  const catCompliance = await prisma.category.upsert({
    where: { id: 'seed-cat-compliance' },
    update: {},
    create: {
      id: 'seed-cat-compliance',
      name: 'Compliance y Normativas',
      description: 'Políticas internas, regulaciones y buenas prácticas empresariales.',
      order: 4,
    },
  });

  console.log(`    ✅ Categorías: ${catVentas.name}, ${catCaja.name}, ${catInventario.name}, ${catCompliance.name}`);

  // 4. Asignar roles a categorías
  console.log('  → Asignando roles a categorías...');
  const roleAssignments = [
    { categoryId: catVentas.id, roleId: ventasRole.id },
    { categoryId: catCaja.id, roleId: cajeroRole.id },
    { categoryId: catInventario.id, roleId: bodegaRole.id },
  ];

  for (const assignment of roleAssignments) {
    await prisma.categoryRole.upsert({
      where: {
        categoryId_roleId: {
          categoryId: assignment.categoryId,
          roleId: assignment.roleId,
        },
      },
      update: {},
      create: assignment,
    });
  }
  console.log('    ✅ Roles asignados a categorías');

  // 5. Crear Tags
  console.log('  → Creando tags...');
  const tagNames = ['ventas', 'caja', 'inventario', 'atención al cliente', 'POS', 'facturación', 'devoluciones', 'compliance'];
  const tags: Record<string, string> = {};
  for (const name of tagNames) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    tags[name] = tag.id;
  }
  console.log(`    ✅ ${tagNames.length} tags creados`);

  console.log('\n🎉 Seed completado exitosamente!');
  console.log('   Credenciales:');
  console.log('   Admin  → admin / admin123');
  console.log('   Cajero → cajero1 / test123');
  console.log('   Vendedor → vendedor1 / test123');
}

seed()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
