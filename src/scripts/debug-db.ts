// @ts-nocheck
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Directive } from '../modules/directives/entities/directive.entity';
import { BoardAgenda } from '../modules/boards/entities/board-agenda.entity';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + '/../modules/**/*.entity.ts'], // Correct path: src/scripts/../modules -> src/modules
    synchronize: false,
    logging: true,
});

async function run() {
    try {
        await AppDataSource.initialize();
        console.log('Connected to DB:', process.env.DATABASE_HOST);

        // List tables
        const result = await AppDataSource.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public';`);
        console.log('Tables:', result.map(r => r.table_name).join(', '));

        const dirRepo = AppDataSource.getRepository(Directive);
        console.log('Directive count:', await dirRepo.count());

        const conRepo = AppDataSource.getRepository('Constituency'); // Use string name if import difficult or rely on wildcard
        console.log('Constituency count:', await conRepo.count());

        const issueRepo = AppDataSource.getRepository('Issue');
        console.log('Issue count:', await issueRepo.count());

        // Try insert
        const d = new Directive();
        d.letterNumber = 'DEBUG-001';
        d.subject = 'Debug Insert';
        d.issueDate = new Date();
        d.timeline = new Date();
        d.status = 1;
        d.isArchived = false;

        console.log('Inserting debug directive...');
        await dirRepo.save(d);
        console.log('Inserted.');

        const countAfter = await dirRepo.count();
        console.log('Directive count after:', countAfter);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await AppDataSource.destroy();
    }
}

run();
