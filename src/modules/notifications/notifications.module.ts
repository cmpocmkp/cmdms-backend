import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService, TypeOrmModule],
})
export class NotificationsModule {}

