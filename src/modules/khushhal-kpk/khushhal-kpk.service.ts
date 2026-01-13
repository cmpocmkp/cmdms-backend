import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KhushhalTask } from './entities/khushhal-task.entity';
import { KhushhalProgress } from './entities/khushhal-progress.entity';
import { KhushhalReply } from './entities/khushhal-reply.entity';
import { KhushhalTaskAssignment } from './entities/khushhal-task-assignment.entity';
import { CreateKhushhalTaskDto } from './dto/create-khushhal-task.dto';
import { UpdateKhushhalTaskDto } from './dto/update-khushhal-task.dto';
import { CreateKhushhalProgressDto } from './dto/create-khushhal-progress.dto';
import { CreateKhushhalReplyDto } from './dto/create-khushhal-reply.dto';

@Injectable()
export class KhushhalKpkService {
  constructor(
    @InjectRepository(KhushhalTask)
    private taskRepository: Repository<KhushhalTask>,
    @InjectRepository(KhushhalProgress)
    private progressRepository: Repository<KhushhalProgress>,
    @InjectRepository(KhushhalReply)
    private replyRepository: Repository<KhushhalReply>,
    @InjectRepository(KhushhalTaskAssignment)
    private assignmentRepository: Repository<KhushhalTaskAssignment>,
  ) { }

  async createTask(createDto: any, createdBy: number): Promise<KhushhalTask> {
    const { departmentIds, ...taskData } = createDto;

    // Create task
    const task = this.taskRepository.create({
      ...taskData,
      createdBy,
    });
    const savedTask = (await this.taskRepository.save(task)) as unknown as KhushhalTask;

    // Create assignments
    if (departmentIds && departmentIds.length > 0) {
      const assignments = departmentIds.map((deptId: number) =>
        this.assignmentRepository.create({
          khushhalTaskId: savedTask.id,
          departmentId: deptId,
          status: taskData.status, // Initial status
        }),
      );
      await this.assignmentRepository.save(assignments);
    }

    return this.findOne(savedTask.id);
  }

  async findAll() {
    return await this.taskRepository.find({
      where: { isArchived: false },
      relations: ['assignments', 'assignments.department', 'progress', 'replies'],
      order: { targetDate: 'ASC' },
    });
  }

  async findOne(id: number): Promise<KhushhalTask> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: [
        'assignments',
        'assignments.department',
        'progress',
        'progress.uploader',
        'progress.department',
        'replies',
        'replies.user',
        'replies.department'
      ],
    });

    if (!task) {
      throw new NotFoundException(`Khushhal KPK Task with ID ${id} not found`);
    }

    // Map assignments to "departments" prop for frontend compatibility if needed
    // But better to just let frontend use assignments
    return task;
  }

  async updateTask(id: number, updateDto: any, modifiedBy: number): Promise<KhushhalTask> {
    const task = await this.findOne(id);
    const { departmentIds, ...taskData } = updateDto;

    Object.assign(task, taskData);
    task.modifiedBy = modifiedBy;
    await this.taskRepository.save(task);

    if (departmentIds) {
      // Re-assign departments
      // Remove old assignments? Or merge? 
      // Simple strategy: Remove all and re-add (safest for "replace" logic)
      // Complexity: preserving status? 
      // For now, let's just add new ones if expecting additive, or sync. 
      // Frontends usually send current list. 

      // Let's check existing
      const existing = await this.assignmentRepository.find({ where: { khushhalTaskId: id } });
      const existingIds = existing.map(a => a.departmentId);

      // Remove ones not in new list
      const toRemove = existing.filter(a => !departmentIds.includes(a.departmentId));
      if (toRemove.length > 0) {
        await this.assignmentRepository.remove(toRemove);
      }

      // Add ones not in existing
      const toAdd = departmentIds.filter((did: number) => !existingIds.includes(did));
      if (toAdd.length > 0) {
        const newAssignments = toAdd.map((did: number) => this.assignmentRepository.create({
          khushhalTaskId: id,
          departmentId: did,
          status: task.status
        }));
        await this.assignmentRepository.save(newAssignments);
      }
    }

    return this.findOne(id);
  }

  async deleteTask(id: number): Promise<void> {
    await this.taskRepository.update(id, { isArchived: true });
  }

  // --- Progress ---

  async submitProgress(taskId: number, progressDto: any, userId: number): Promise<KhushhalProgress> {
    const progress = this.progressRepository.create({
      khushhalTaskId: taskId,
      uploadedBy: userId,
      ...progressDto,
    });
    return await this.progressRepository.save(progress) as unknown as KhushhalProgress;
  }

  // --- Replies ---

  async submitReply(taskId: number, replyDto: any, userId: number): Promise<KhushhalReply> {
    const replyEntity = this.replyRepository.create({
      khushhalTaskId: taskId,
      userId,
      ...replyDto,
    });
    return await this.replyRepository.save(replyEntity) as unknown as KhushhalReply;
  }

  async getReplies(taskId: number): Promise<KhushhalReply[]> {
    return this.replyRepository.find({
      where: { khushhalTaskId: taskId },
      relations: ['user', 'department'],
      order: { createdAt: 'ASC' }
    });
  }

  // --- Dept Status ---

  async updateDepartmentStatus(taskId: number, departmentId: number, status: number) {
    let assignment = await this.assignmentRepository.findOne({
      where: { khushhalTaskId: taskId, departmentId }
    });

    if (!assignment) {
      // Create if not exists (implicit assignment?)
      assignment = this.assignmentRepository.create({
        khushhalTaskId: taskId,
        departmentId,
        status
      });
    } else {
      assignment.status = status;
    }

    return this.assignmentRepository.save(assignment);
  }
}
