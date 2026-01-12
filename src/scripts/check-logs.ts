
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { ActivityLog } from '../modules/activity-logs/entities/activity-log.entity';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + '/../modules/**/*.entity.ts'],
    synchronize: false,
    logging: false,
});

async function run() {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(ActivityLog);
    const count = await repo.count();
    console.log(`ActivityLog count: ${count}`);
    const last = await repo.findOne({ where: { id: 10 } }); // ID 10 exists in JSON check properties
    console.log('Sample Log:', JSON.stringify(last, null, 2));
    process.exit(0);
}

run();
