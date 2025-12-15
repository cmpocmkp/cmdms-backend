import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KhushhalTask } from './entities/khushhal-task.entity';
import { KhushhalProgress } from './entities/khushhal-progress.entity';
import { KhushhalReply } from './entities/khushhal-reply.entity';

@Injectable()
export class KhushhalKpkService {
  constructor(
    @InjectRepository(KhushhalTask)
    private taskRepository: Repository<KhushhalTask>,
    @InjectRepository(KhushhalProgress)
    private progressRepository: Repository<KhushhalProgress>,
    @InjectRepository(KhushhalReply)
    private replyRepository: Repository<KhushhalReply>,
  ) {}

  async createTask(taskData: any, createdBy: number): Promise<KhushhalTask> {
    const task = this.taskRepository.create({
      ...taskData,
      createdBy,
    });
    return await this.taskRepository.save(task) as unknown as KhushhalTask;
  }

  async findAll() {
    return await this.taskRepository.find({
      where: { isArchived: false },
      relations: ['departments', 'progress', 'replies'],
      order: { targetDate: 'ASC' },
    });
  }

  async findOne(id: number): Promise<KhushhalTask> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['departments', 'progress', 'progress.uploader', 'replies', 'replies.user', 'replies.department'],
    });

    if (!task) {
      throw new NotFoundException(`Khushhal KPK Task with ID ${id} not found`);
    }

    return task;
  }

  async submitProgress(taskId: number, progressData: any, userId: number): Promise<KhushhalProgress> {
    const progress = this.progressRepository.create({
      khushhalTaskId: taskId,
      uploadedBy: userId,
      ...progressData,
    });
    return await this.progressRepository.save(progress) as unknown as KhushhalProgress;
  }

  async submitReply(taskId: number, departmentId: number, userId: number, reply: string, isAdmin: boolean = false): Promise<KhushhalReply> {
    const replyEntity = this.replyRepository.create({
      khushhalTaskId: taskId,
      departmentId,
      userId,
      reply,
      isAdminReply: isAdmin,
    });
    return await this.replyRepository.save(replyEntity);
  }

  async updateStatus(id: number, status: number, modifiedBy: number): Promise<KhushhalTask> {
    const task = await this.findOne(id);
    task.status = status;
    task.modifiedBy = modifiedBy;
    return await this.taskRepository.save(task);
  }
}

