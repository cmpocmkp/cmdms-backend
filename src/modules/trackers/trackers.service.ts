import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In } from 'typeorm';
import { Tracker } from './entities/tracker.entity';
import { TrackerActivity } from './entities/tracker-activity.entity';
import { TrackerReply } from './entities/tracker-reply.entity';
import { TrackerActivityReply } from './entities/tracker-activity-reply.entity';
import { Department } from '../departments/entities/department.entity';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { CreateTrackerActivityDto } from './dto/create-tracker-activity.dto';
import { UpdateTrackerActivityDto } from './dto/update-tracker-activity.dto';
import { CreateTrackerReplyDto } from './dto/create-tracker-reply.dto';
import { AssignTrackerDto } from './dto/assign-tracker.dto';

@Injectable()
export class TrackersService {
    constructor(
        @InjectRepository(Tracker)
        private trackerRepository: Repository<Tracker>,
        @InjectRepository(TrackerActivity)
        private trackerActivityRepository: Repository<TrackerActivity>,
        @InjectRepository(TrackerReply)
        private trackerReplyRepository: Repository<TrackerReply>,
        @InjectRepository(TrackerActivityReply)
        private trackerActivityReplyRepository: Repository<TrackerActivityReply>,
        @InjectRepository(Department)
        private departmentRepository: Repository<Department>,
    ) { }

    async create(createTrackerDto: CreateTrackerDto) {
        const { activities, departmentIds, ...trackerData } = createTrackerDto;

        const tracker = this.trackerRepository.create(trackerData);

        if (departmentIds && departmentIds.length > 0) {
            tracker.departments = await this.departmentRepository.findBy({ id: In(departmentIds) });
        }

        const savedTracker = await this.trackerRepository.save(tracker);

        if (activities && activities.length > 0) {
            const activitiesToCreate = activities.map(activity =>
                this.trackerActivityRepository.create({
                    ...activity,
                    trackerId: savedTracker.id
                })
            );
            await this.trackerActivityRepository.save(activitiesToCreate);
        }

        return this.findOne(savedTracker.id);
    }

    async findAll(query: any) {
        const { page = 1, limit = 10, type, status, departmentId, search, fromDate, toDate, sortBy = 'createdAt', sortOrder = 'DESC' } = query;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (type) where.type = type;
        if (status) where.status = status;
        if (search) where.title = Like(`%${search}%`);
        if (fromDate && toDate) where.createdAt = Between(fromDate, toDate);

        if (departmentId) {
            where.departments = { id: departmentId };
        }

        const [data, total] = await this.trackerRepository.findAndCount({
            where,
            relations: ['departments'],
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
        const tracker = await this.trackerRepository.findOne({
            where: { id },
            relations: ['departments', 'activities', 'activities.department', 'replies', 'replies.user']
        });
        if (!tracker) throw new NotFoundException(`Tracker #${id} not found`);
        return { success: true, data: tracker };
    }

    async update(id: number, updateTrackerDto: UpdateTrackerDto) {
        const tracker = await this.trackerRepository.preload({
            id,
            ...updateTrackerDto
        });
        if (!tracker) throw new NotFoundException(`Tracker #${id} not found`);

        await this.trackerRepository.save(tracker);
        const updated = await this.findOne(id);
        return { success: true, data: updated.data, message: 'Tracker updated successfully' };
    }

    async remove(id: number) {
        const tracker = await this.trackerRepository.findOne({ where: { id } });
        if (!tracker) throw new NotFoundException(`Tracker #${id} not found`);
        await this.trackerRepository.remove(tracker);
        return { success: true, message: 'Tracker deleted successfully' };
    }

    async assignDepartments(id: number, assignDto: AssignTrackerDto) {
        const tracker = await this.trackerRepository.findOne({
            where: { id },
            relations: ['departments']
        });
        if (!tracker) throw new NotFoundException(`Tracker #${id} not found`);

        const departments = await this.departmentRepository.findBy({ id: In(assignDto.departmentIds) });
        tracker.departments = departments;

        await this.trackerRepository.save(tracker);

        return {
            success: true,
            data: { trackerId: tracker.id, departments },
            message: 'Tracker assigned to departments successfully'
        };
    }

    // --- Activities ---

    async findActivities(trackerId: number) {
        const data = await this.trackerActivityRepository.find({
            where: { trackerId },
            relations: ['department']
        });
        return { success: true, data };
    }

    async createActivity(trackerId: number, activityDto: CreateTrackerActivityDto) {
        const activity = this.trackerActivityRepository.create({
            ...activityDto,
            trackerId
        });
        await this.trackerActivityRepository.save(activity);
        return { success: true, data: activity, message: 'Activity created successfully' };
    }

    async updateActivity(id: number, activityDto: UpdateTrackerActivityDto) {
        const activity = await this.trackerActivityRepository.preload({
            id,
            ...activityDto
        });
        if (!activity) throw new NotFoundException(`Activity #${id} not found`);
        await this.trackerActivityRepository.save(activity);
        return { success: true, data: activity, message: 'Activity updated successfully' };
    }

    async removeActivity(id: number) {
        const activity = await this.trackerActivityRepository.findOne({ where: { id } });
        if (!activity) throw new NotFoundException(`Activity #${id} not found`);
        await this.trackerActivityRepository.remove(activity);
        return { success: true, message: 'Activity deleted successfully' };
    }

    // --- Replies ---
    async findReplies(trackerId: number) {
        const data = await this.trackerReplyRepository.find({
            where: { trackerId },
            relations: ['user']
        });
        return { success: true, data };
    }

    async createReply(trackerId: number, userId: number, replyDto: CreateTrackerReplyDto) {
        const reply = this.trackerReplyRepository.create({
            content: replyDto.content,
            trackerId,
            userId
        });
        await this.trackerReplyRepository.save(reply);
        const fullReply = await this.trackerReplyRepository.findOne({ where: { id: reply.id }, relations: ['user'] });
        return { success: true, data: fullReply, message: 'Reply added successfully' };
    }

    async findActivityReplies(activityId: number) {
        const data = await this.trackerActivityReplyRepository.find({
            where: { activityId },
            relations: ['user']
        });
        return { success: true, data };
    }

    async createActivityReply(activityId: number, userId: number, replyDto: CreateTrackerReplyDto) {
        const reply = this.trackerActivityReplyRepository.create({
            content: replyDto.content,
            activityId,
            userId
        });
        await this.trackerActivityReplyRepository.save(reply);
        const fullReply = await this.trackerActivityReplyRepository.findOne({ where: { id: reply.id }, relations: ['user'] });
        return { success: true, data: fullReply, message: 'Reply added successfully' };
    }
}
