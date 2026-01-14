import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Department } from '../departments/entities/department.entity';
import { Task } from '../tasks/entities/task.entity';
import { Directive } from '../directives/entities/directive.entity';
import { Meeting } from '../meetings/entities/meeting.entity';
import { Tracker } from '../trackers/entities/tracker.entity';
import { Minute } from '../minutes/entities/minute.entity';
import { Announcement } from '../announcements/entities/announcement.entity';
import { SectorialMeeting } from '../sectorial-meetings/entities/sectorial-meeting.entity';
import { Board } from '../boards/entities/board.entity';
import { BoardMeeting } from '../boards/entities/board-meeting.entity';
import { BoardAct } from '../boards/entities/board-act.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Department,
      Task,
      Directive,
      Meeting,
      Tracker,
      Minute,
      Announcement,
      SectorialMeeting,
      Board,
      BoardMeeting,
      BoardAct
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule { }

