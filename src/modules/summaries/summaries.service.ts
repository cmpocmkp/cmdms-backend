import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Department } from '../departments/entities/department.entity';
import { Summary } from './entities/summary.entity';
import { SummaryTask } from './entities/summary-task.entity';
import { SummaryReply } from './entities/summary-reply.entity';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { UpdateSummaryDto } from './dto/update-summary.dto';
import { CreateSummaryTaskDto } from './dto/create-summary-task.dto';
import { UpdateSummaryTaskDto } from './dto/update-summary-task.dto';
import { CreateSummaryReplyDto } from './dto/create-summary-reply.dto';

@Injectable()
export class SummariesService {
    constructor(
        @InjectRepository(Summary)
        private summaryRepository: Repository<Summary>,
        @InjectRepository(SummaryTask)
        private summaryTaskRepository: Repository<SummaryTask>,
        @InjectRepository(SummaryReply)
        private summaryReplyRepository: Repository<SummaryReply>,
    ) { }

    async create(createSummaryDto: CreateSummaryDto) {
        const { tasks, departmentIds, ...summaryData } = createSummaryDto;

        // Create the summary
        const summary = this.summaryRepository.create(summaryData);
        const savedSummary = await this.summaryRepository.save(summary);

        // Create tasks if provided
        if (tasks && tasks.length > 0) {
            const tasksToCreate = tasks.map(task =>
                this.summaryTaskRepository.create({
                    ...task,
                    summaryId: savedSummary.id
                })
            );
            await this.summaryTaskRepository.save(tasksToCreate);
        }
        // Fallback: If no tasks but departmentIds are provided, create default tasks for each department
        else if (departmentIds && departmentIds.length > 0) {
            const tasksToCreate = departmentIds.map(deptId =>
                this.summaryTaskRepository.create({
                    title: `Follow up with department`, // Default title
                    description: summaryData.description, // Inherit description or keep empty
                    departmentId: deptId,
                    summaryId: savedSummary.id,
                    timeline: summaryData.date // Default timeline
                })
            );
            await this.summaryTaskRepository.save(tasksToCreate);
        }

        return this.findOne(savedSummary.id);
    }

    async findAll(query: any) {
        const { page = 1, limit = 10, departmentId, status, search, fromDate, toDate, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (departmentId) {
            where.initiatorDepartmentId = departmentId;
        }
        if (status) {
            where.status = status;
        }
        if (search) {
            where.subject = Like(`%${search}%`);
        }
        if (fromDate && toDate) {
            where.date = Between(fromDate, toDate);
        }

        const [data, total] = await this.summaryRepository.findAndCount({
            where,
            relations: ['initiatorDepartment'],
            order: { [sortBy]: sortOrder.toUpperCase() },
            skip,
            take: +limit
        });

        return {
            success: true,
            data,
            meta: {
                total,
                page: +page,
                limit: +limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async findOne(id: number) {
        const summary = await this.summaryRepository.findOne({
            where: { id },
            relations: ['initiatorDepartment', 'tasks', 'tasks.department', 'replies', 'replies.user']
        });

        if (!summary) throw new NotFoundException(`Summary #${id} not found`);

        // Format response to match user expectation:
        // data: { ...summary, attachments: ... }
        // Since attachments are not fully implemented in relations, assume empty or fetch if File entity logic exists.
        // For now, return as is. The user mentioned "attachments" in response. 
        return { success: true, data: summary };
    }

    async update(id: number, updateSummaryDto: UpdateSummaryDto) {
        const summary = await this.summaryRepository.preload({
            id,
            ...updateSummaryDto
        });
        if (!summary) throw new NotFoundException(`Summary #${id} not found`);

        await this.summaryRepository.save(summary);

        // Return the full object
        const updated = await this.findOne(id);
        return { success: true, data: updated.data, message: 'Summary updated successfully' };
    }

    async remove(id: number) {
        const summary = await this.summaryRepository.findOne({ where: { id } });
        if (!summary) throw new NotFoundException(`Summary #${id} not found`);

        await this.summaryRepository.remove(summary);
        return { success: true, message: 'Summary deleted successfully' };
    }

    // --- Task Methods ---

    async findTasks(summaryId: number) {
        const data = await this.summaryTaskRepository.find({
            where: { summaryId },
            relations: ['department']
        });
        return { success: true, data };
    }

    async createTask(summaryId: number, taskDto: CreateSummaryTaskDto) {
        const task = this.summaryTaskRepository.create({
            ...taskDto,
            summaryId
        });
        await this.summaryTaskRepository.save(task);
        return { success: true, data: task, message: 'Task created successfully' };
    }

    async updateTask(id: number, taskDto: UpdateSummaryTaskDto) {
        const task = await this.summaryTaskRepository.preload({
            id,
            ...taskDto
        });
        if (!task) throw new NotFoundException(`Task #${id} not found`);
        await this.summaryTaskRepository.save(task);
        return { success: true, data: task, message: 'Task updated successfully' };
    }

    async removeTask(id: number) {
        const task = await this.summaryTaskRepository.findOne({ where: { id } });
        if (!task) throw new NotFoundException(`Task #${id} not found`);
        await this.summaryTaskRepository.remove(task);
        return { success: true, message: 'Task deleted successfully' };
    }

    // --- Reply Methods ---

    async findReplies(summaryId: number) {
        const data = await this.summaryReplyRepository.find({
            where: { summaryId },
            relations: ['user']
        });
        return { success: true, data };
    }

    async createReply(summaryId: number, userId: number, replyDto: CreateSummaryReplyDto) {
        const reply = this.summaryReplyRepository.create({
            content: replyDto.content,
            summaryId,
            userId
            // Attachments logic would go here
        });
        await this.summaryReplyRepository.save(reply);

        const fullReply = await this.summaryReplyRepository.findOne({
            where: { id: reply.id },
            relations: ['user']
        });

        return { success: true, data: fullReply, message: 'Reply added successfully' };
    }
}
