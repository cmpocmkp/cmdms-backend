import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SenateMeetingsController } from './senate-meetings.controller';
import { SenateMeeting } from './entities/senate-meeting.entity';
import { SenateMember } from './entities/senate-member.entity';
import { SenateMinute } from './entities/senate-minute.entity';
import { SenateMeetingsService } from './senate-meetings.service';

@Module({
  imports: [TypeOrmModule.forFeature([SenateMeeting, SenateMember, SenateMinute])],
  controllers: [SenateMeetingsController],
  providers: [SenateMeetingsService],
  exports: [TypeOrmModule, SenateMeetingsService],
})
export class SenateMeetingsModule { }

