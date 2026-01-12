import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Department } from '../departments/entities/department.entity';
import { Task } from '../tasks/entities/task.entity';
import { Directive } from '../directives/entities/directive.entity';
import { Meeting } from '../meetings/entities/meeting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department, Task, Directive, Meeting]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule { }

