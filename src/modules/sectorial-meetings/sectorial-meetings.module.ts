import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectorialMeetingsController } from './sectorial-meetings.controller';
import { SectorialMeeting } from './entities/sectorial-meeting.entity';
import { SectorialAgenda } from './entities/sectorial-agenda.entity';
import { SectorialMeetingsService } from './sectorial-meetings.service';

@Module({
  imports: [TypeOrmModule.forFeature([SectorialMeeting, SectorialAgenda])],
  controllers: [SectorialMeetingsController],
  providers: [SectorialMeetingsService],
  exports: [TypeOrmModule, SectorialMeetingsService],
})
export class SectorialMeetingsModule { }

