import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { runSeeders } from './seeders';

// Load environment variables
dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'cmdms',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: false,
});

async function main() {
  try {
    console.log('📡 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✓ Database connected\n');

    await runSeeders(AppDataSource);

    await AppDataSource.destroy();
    console.log('\n📡 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();

