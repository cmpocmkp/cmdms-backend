import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsController } from './announcements.controller';
import { Announcement } from './entities/announcement.entity';
import { AnnouncementDetail } from './entities/announcement-detail.entity';
import { AnnouncementResponse } from './entities/announcement-response.entity';

import { AnnouncementDetailsService } from './announcement-details.service';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement, AnnouncementDetail, AnnouncementResponse])],
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService, AnnouncementDetailsService],
  exports: [AnnouncementsService, TypeOrmModule],
})
export class AnnouncementsModule { }

