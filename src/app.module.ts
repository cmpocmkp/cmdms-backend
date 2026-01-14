import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import appConfig from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { MinutesModule } from './modules/minutes/minutes.module';
import { DirectivesModule } from './modules/directives/directives.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { ComplaintsModule } from './modules/complaints/complaints.module';
import { IssuesModule } from './modules/issues/issues.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { KpiModule } from './modules/kpi/kpi.module';
import { TagsModule } from './modules/tags/tags.module';
import { ActivityLogsModule } from './modules/activity-logs/activity-logs.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { FilesModule } from './modules/files/files.module';
import { BoardsModule } from './modules/boards/boards.module';
import { PtfModule } from './modules/ptf/ptf.module';
import { KhushhalKpkModule } from './modules/khushhal-kpk/khushhal-kpk.module';
import { SchemesModule } from './modules/schemes/schemes.module';
import { SectorialMeetingsModule } from './modules/sectorial-meetings/sectorial-meetings.module';
import { SenateMeetingsModule } from './modules/senate-meetings/senate-meetings.module';
import { CmRemarksModule } from './modules/cm-remarks/cm-remarks.module';
import { PublicDaysModule } from './modules/public-days/public-days.module';
import { WelfareModule } from './modules/welfare/welfare.module';
import { InaugurationsModule } from './modules/inaugurations/inaugurations.module';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { LettersModule } from './modules/letters/letters.module';
import { ReportsModule } from './modules/reports/reports.module';
import { MigrationModule } from './modules/migration/migration.module';
import { SummariesModule } from './modules/summaries/summaries.module';
import { TrackersModule } from './modules/trackers/trackers.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, appConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
        autoLoadEntities: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    DepartmentsModule,
    MeetingsModule,
    MinutesModule,
    DirectivesModule,
    AnnouncementsModule,
    ComplaintsModule,
    IssuesModule,
    TasksModule,
    KpiModule,
    TagsModule,
    ActivityLogsModule,
    NotificationsModule,
    FilesModule,
    BoardsModule,
    PtfModule,
    KhushhalKpkModule,
    SchemesModule,
    SectorialMeetingsModule,
    SenateMeetingsModule,
    CmRemarksModule,
    PublicDaysModule,
    WelfareModule,
    InaugurationsModule,
    CandidatesModule,
    LettersModule,
    ReportsModule,
    MigrationModule,
    SummariesModule,
    TrackersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule { }
