import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationType } from '../../common/enums';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(
    userId: number,
    type: NotificationType,
    title: string,
    message: string,
    notifiableType?: string,
    notifiableId?: number,
    data?: any,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      userId,
      type,
      title,
      message,
      notifiableType,
      notifiableId,
      data,
    });
    return await this.notificationRepository.save(notification);
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: number): Promise<Notification | null> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (notification) {
      notification.readAt = new Date();
      return await this.notificationRepository.save(notification);
    }
    return null;
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { userId, readAt: IsNull() } as any,
      { readAt: new Date() },
    );
  }

  async getUnreadCount(userId: number): Promise<number> {
    return await this.notificationRepository.count({
      where: { userId, readAt: IsNull() } as any,
    });
  }
}

