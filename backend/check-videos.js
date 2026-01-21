const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Conectando a PostgreSQL...');
    await client.connect();
    console.log('✅ Conectado!\n');
    
    // Ver categorías
    console.log('📋 CATEGORÍAS:');
    const categories = await client.query('SELECT id, name, "isActive" FROM categories ORDER BY "order"');
    console.table(categories.rows);
    
    // Ver videos y sus categorías
    console.log('\n📹 VIDEOS Y SUS CATEGORÍAS:');
    const videos = await client.query(`
      SELECT 
        v.id, 
        v.title, 
        v."isActive" as video_active,
        v."categoryId",
        c.name as category_name,
        c."isActive" as category_active
      FROM videos v
      LEFT JOIN categories c ON v."categoryId" = c.id
      ORDER BY v.title
    `);
    console.table(videos.rows);
    
    // Contar videos por categoría
    console.log('\n📊 VIDEOS POR CATEGORÍA:');
    const counts = await client.query(`
      SELECT 
        c.id,
        c.name,
        c."isActive",
        COUNT(v.id) as total_videos,
        COUNT(CASE WHEN v."isActive" = true THEN 1 END) as active_videos
      FROM categories c
      LEFT JOIN videos v ON c.id = v."categoryId"
      GROUP BY c.id, c.name, c."isActive"
      ORDER BY c."order"
    `);
    console.table(counts.rows);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Desconectado');
  }
}

main();
