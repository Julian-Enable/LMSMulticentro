const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Conectando a PostgreSQL...');
    await client.connect();
    console.log('✅ Conectado!');
    
    // Obtener el ID del rol ADMIN
    const roleResult = await client.query("SELECT id FROM roles WHERE code = 'ADMIN'");
    
    if (roleResult.rows.length === 0) {
      console.error('❌ No se encontró el rol ADMIN');
      process.exit(1);
    }
    
    const adminRoleId = roleResult.rows[0].id;
    console.log(`📋 ID del rol ADMIN: ${adminRoleId}`);
    
    // Listar usuarios actuales
    console.log('\n📋 Usuarios actuales:');
    const usersResult = await client.query('SELECT id, username, email, "roleId" FROM users');
    console.table(usersResult.rows);
    
    // Actualizar usuario admin (puedes cambiar el email si es diferente)
    console.log('\n🔄 Actualizando usuario admin...');
    const updateResult = await client.query(
      'UPDATE users SET "roleId" = $1 WHERE email = $2 OR username ILIKE $3 RETURNING id, username, email, "roleId"',
      [adminRoleId, 'admin@multicentro.com', '%admin%']
    );
    
    if (updateResult.rows.length > 0) {
      console.log('\n✅ Usuario(s) actualizado(s):');
      console.table(updateResult.rows);
    } else {
      console.log('\n⚠️ No se encontró ningún usuario admin. Intentando con todos los usuarios...');
      
      // Mostrar todos los usuarios para que el usuario elija
      const allUsers = await client.query('SELECT id, username, email FROM users ORDER BY username');
      console.log('\n📋 Todos los usuarios:');
      console.table(allUsers.rows);
      
      console.log('\n💡 Ejecuta este comando para actualizar un usuario específico:');
      console.log(`   UPDATE users SET "roleId" = '${adminRoleId}' WHERE id = 'USER_ID_AQUI';`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Desconectado de PostgreSQL');
  }
}

main();
