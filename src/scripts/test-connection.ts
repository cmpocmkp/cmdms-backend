import { Client } from 'pg';

/**
 * Simple Database Connection Test
 * 
 * Tests connectivity to the PostgreSQL database
 * Usage: ts-node src/scripts/test-connection.ts
 */

const DB_URL = 'postgresql://postgres:SSvMLVufcETbSHtUQSrkTvHbLtfbrdYj@metro.proxy.rlwy.net:29553/railway';

async function testConnection(): Promise<void> {
  console.log('\n🔌 Testing PostgreSQL Connection...\n');
  console.log('Host: metro.proxy.rlwy.net:29553');
  console.log('Database: railway\n');

  const client = new Client({ connectionString: DB_URL });

  try {
    // Connect
    console.log('⏳ Connecting...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Test query
    console.log('📊 Database Information:');
    console.log('─'.repeat(50));
    
    const versionResult = await client.query('SELECT version()');
    console.log(`Version: ${versionResult.rows[0].version.split(',')[0]}`);

    const sizeResult = await client.query(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    `);
    console.log(`Size: ${sizeResult.rows[0].size}`);

    const tableResult = await client.query(`
      SELECT COUNT(*) as table_count
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
    `);
    console.log(`Tables: ${tableResult.rows[0].table_count}`);

    const recordResult = await client.query(`
      SELECT 
        SUM(n_live_tup) as total_records
      FROM pg_stat_user_tables
    `);
    console.log(`Total Records: ${recordResult.rows[0].total_records || 0}`);

    console.log('─'.repeat(50));
    console.log('\n✅ Connection test successful!\n');

  } catch (err) {
    console.error('\n❌ Connection failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  testConnection();
}

export { testConnection };

