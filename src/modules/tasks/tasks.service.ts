import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskComment } from './entities/task-comment.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskComment)
    private commentRepository: Repository<TaskComment>,
  ) {}

  async create(createTaskDto: CreateTaskDto, createdBy: number): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      createdBy,
    });
    return await this.taskRepository.save(task);
  }

  async findAll(paginationDto: PaginationDto, userId?: number, departmentId?: number) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const query = this.taskRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .leftJoinAndSelect('task.departments', 'departments')
      .skip(skip)
      .take(limit)
      .orderBy('task.dueDate', 'ASC');

    if (userId) {
      query.andWhere('task.assignedTo = :userId', { userId });
    }

    if (departmentId) {
      query.andWhere('departments.id = :departmentId', { departmentId });
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      metadata: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignee', 'departments', 'comments', 'comments.user'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async updateStatus(id: number, status: string, modifiedBy: number): Promise<Task> {
    const task = await this.findOne(id);
    task.status = status;
    task.modifiedBy = modifiedBy;
    return await this.taskRepository.save(task);
  }

  async addComment(taskId: number, userId: number, comment: string): Promise<TaskComment> {
    const taskComment = this.commentRepository.create({
      taskId,
      userId,
      comment,
    });
    return await this.commentRepository.save(taskComment);
  }
}

