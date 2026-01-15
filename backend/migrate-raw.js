const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Conectando a PostgreSQL...');
    await client.connect();
    console.log('✅ Conectado!');
    
    console.log('📦 Leyendo archivo de migración...');
    const migrationPath = path.join(__dirname, 'prisma', 'migrations', '20260115020000_convert_roles_to_dynamic_model', 'migration.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    
    console.log('🚀 Ejecutando migración...');
    await client.query(sql);
    
    console.log('✅ Migración ejecutada exitosamente!');
    
    // Verificar roles creados
    const result = await client.query('SELECT code, name FROM roles ORDER BY code');
    console.log('\n📋 Roles creados:');
    console.table(result.rows);
    
    console.log('\n✨ Todo listo! La base de datos está actualizada.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nDetalles completos:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Desconectado de PostgreSQL');
  }
}

main();
