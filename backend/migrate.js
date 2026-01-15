const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  console.log('📦 Leyendo archivo de migración...');
  
  const migrationPath = path.join(__dirname, 'prisma', 'migrations', '20260115020000_convert_roles_to_dynamic_model', 'migration.sql');
  const sql = fs.readFileSync(migrationPath, 'utf-8');
  
  console.log('🚀 Ejecutando migración...');
  
  try {
    // Ejecutar SQL usando queryRaw sin prepared statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        console.log(`Ejecutando statement ${i + 1}/${statements.length}...`);
        await prisma.$executeRawUnsafe(statement);
      }
    }
    
    console.log('✅ Migración ejecutada exitosamente!');
    
    // Verificar roles creados
    const roles = await prisma.$queryRaw`SELECT code, name FROM roles ORDER BY code`;
    console.log('\n📋 Roles creados:');
    console.table(roles);
    
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
