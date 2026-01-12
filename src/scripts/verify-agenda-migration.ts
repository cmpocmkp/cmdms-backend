
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { BoardAgenda } from '../modules/boards/entities/board-agenda.entity';
import { Department } from '../modules/departments/entities/department.entity';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'cmdms',
    entities: [BoardAgenda, Department, __dirname + '/../modules/**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: false,
});

async function verify() {
    await AppDataSource.initialize();
    console.log('Database connected.');

    const repo = AppDataSource.getRepository(BoardAgenda);
    const count = await repo.count();
    console.log(`Board Agendas in DB: ${count}`);

    // Check Board Meetings
    const meetingRepo = AppDataSource.getRepository('board_meetings'); // Use string name or Entity if imported
    const meetingCount = await meetingRepo.count();
    const meetingIds = await meetingRepo.find({ select: { id: true }, take: 5 });
    console.log(`Board Meetings in DB: ${meetingCount}`);
    console.log('Sample Meeting IDs:', meetingIds.map(m => m.id));


    const sample = await repo.findOne({
        where: {},
        relations: ['relatedDepartments'],
        order: { id: 'DESC' } // Check recently inserted? Or just random.
    });

    if (sample) {
        console.log('Sample Agenda:', sample.id);
        console.log('Description:', sample.description.substring(0, 50));
        console.log('Related Departments:', sample.relatedDepartments?.length);
        if (sample.relatedDepartments?.length > 0) {
            console.log('  Dept IDs:', sample.relatedDepartments.map(d => d.id));
        }
    } else {
        console.log('No agenda items found.');
    }

    const linkedCount = await repo.createQueryBuilder('ba')
        .innerJoin('ba.relatedDepartments', 'd')
        .getCount();

    console.log(`Total Agendas with linked Departments: ${linkedCount}`);

    await AppDataSource.destroy();
}

verify().catch(console.error);
