import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingsService } from './meetings.service';
import { MeetingsController } from './meetings.controller';
import { Meeting } from './entities/meeting.entity';
import { MeetingType } from './entities/meeting-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, MeetingType])],
  controllers: [MeetingsController],
  providers: [MeetingsService],
  exports: [MeetingsService, TypeOrmModule],
})
export class MeetingsModule {}

