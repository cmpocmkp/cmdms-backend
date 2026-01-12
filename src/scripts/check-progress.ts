
import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    const count = await dataSource.query('SELECT COUNT(*) FROM minutes');
    console.log('Minutes count:', count[0].count);

    const deptMinuteCount = await dataSource.query('SELECT COUNT(*) FROM department_minute');
    console.log('Department Minute count:', deptMinuteCount[0].count);

    await app.close();
}
bootstrap();
