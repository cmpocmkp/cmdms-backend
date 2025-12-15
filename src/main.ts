import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Set global prefix
  app.setGlobalPrefix('api');

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('CMDMS API')
    .setDescription(
      "Chief Minister's Decision Management System - Backend API Documentation",
    )
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('roles', 'Role management')
    .addTag('permissions', 'Permission management')
    .addTag('departments', 'Department management')
    .addTag('meetings', 'CM Meetings')
    .addTag('minutes', 'Meeting Minutes/Decisions')
    .addTag('directives', 'Directives Management')
    .addTag('announcements', 'Announcements System')
    .addTag('complaints', 'Complaint Management')
    .addTag('issues', 'Issues (HCM Public Affairs)')
    .addTag('tasks', 'Task Management')
    .addTag('kpi', 'KPI Management & Tracking')
    .addTag('boards', 'Boards & Committees')
    .addTag('ptf', 'PTF Initiatives')
    .addTag('khushhal-kpk', 'Khushhal KPK Program')
    .addTag('schemes', 'Development Schemes')
    .addTag('sectorial-meetings', 'Sectorial & Review Meetings')
    .addTag('senate-meetings', 'Senate Meetings')
    .addTag('cm-remarks', 'CM Remarks & Interventions')
    .addTag('public-days', 'Public Engagement Days')
    .addTag('welfare', 'Welfare Initiatives')
    .addTag('inaugurations', 'Inaugurations & Events')
    .addTag('candidates', 'Candidates & Officers')
    .addTag('letters', 'Letters & Document Generation')
    .addTag('reports', 'Reporting & Analytics')
    .addTag('notifications', 'Notifications')
    .addTag('tags', 'Tags & Categorization')
    .addTag('files', 'File Management')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}
bootstrap();
