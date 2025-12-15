import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
  ) {}

  async log(
    description: string,
    causerId: number,
    subjectType?: string,
    subjectId?: number,
    properties?: any,
    logName?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ActivityLog> {
    const log = this.activityLogRepository.create({
      description,
      causerId,
      causerType: 'User',
      subjectType,
      subjectId,
      properties,
      logName,
      ipAddress,
      userAgent,
    });
    return await this.activityLogRepository.save(log);
  }

  async findAll(filters?: any): Promise<ActivityLog[]> {
    const query = this.activityLogRepository.createQueryBuilder('log')
      .leftJoinAndSelect('log.causer', 'causer')
      .orderBy('log.createdAt', 'DESC')
      .take(100);

    if (filters?.userId) {
      query.andWhere('log.causerId = :userId', { userId: filters.userId });
    }

    if (filters?.logName) {
      query.andWhere('log.logName = :logName', { logName: filters.logName });
    }

    if (filters?.subjectType) {
      query.andWhere('log.subjectType = :subjectType', { subjectType: filters.subjectType });
    }

    return await query.getMany();
  }

  async findBySubject(subjectType: string, subjectId: number): Promise<ActivityLog[]> {
    return await this.activityLogRepository.find({
      where: { subjectType, subjectId },
      relations: ['causer'],
      order: { createdAt: 'DESC' },
    });
  }
}

