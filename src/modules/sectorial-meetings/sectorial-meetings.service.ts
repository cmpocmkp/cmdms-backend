import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SectorialAgenda } from './entities/sectorial-agenda.entity';
import { SectorialMeeting } from './entities/sectorial-meeting.entity';
import { SectorialAgendaReply } from './entities/sectorial-agenda-reply.entity';
import { CreateSectorialMeetingDto } from './dto/create-sectorial-meeting.dto';
import { CreateSectorialAgendaDto } from './dto/create-sectorial-agenda.dto';
import { UpdateSectorialAgendaDto } from './dto/update-sectorial-agenda.dto';
import { CreateSectorialReplyDto } from './dto/create-sectorial-reply.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class SectorialMeetingsService {
    constructor(
        @InjectRepository(SectorialMeeting)
        private sectorialMeetingRepository: Repository<SectorialMeeting>,
        @InjectRepository(SectorialAgenda)
        private sectorialAgendaRepository: Repository<SectorialAgenda>,
        @InjectRepository(SectorialAgendaReply)
        private sectorialAgendaReplyRepository: Repository<SectorialAgendaReply>,
    ) { }

    async create(createDto: CreateSectorialMeetingDto, userId: number): Promise<SectorialMeeting> {
        const meeting = this.sectorialMeetingRepository.create({
            ...createDto,
            createdBy: userId,
            modifiedBy: userId
        });
        return this.sectorialMeetingRepository.save(meeting);
    }

    async findAll(paginationDto: PaginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;

        const [data, total] = await this.sectorialMeetingRepository.findAndCount({
            skip,
            take: limit,
            order: { date: 'DESC' },
            relations: ['department']
        });

        return {
            data,
            metadata: {
                page,
                limit,
                total,
            },
        };
    }

    async findOne(id: number): Promise<SectorialMeeting> {
        const meeting = await this.sectorialMeetingRepository.findOne({
            where: { id },
            relations: ['department', 'agendaItems']
        });

        if (!meeting) {
            throw new NotFoundException(`Sectorial meeting with ID ${id} not found`);
        }

        return meeting;
    }

    async update(id: number, updateDto: any): Promise<SectorialMeeting> {
        const meeting = await this.findOne(id);
        this.sectorialMeetingRepository.merge(meeting, updateDto);
        return this.sectorialMeetingRepository.save(meeting);
    }

    async remove(id: number): Promise<void> {
        const result = await this.sectorialMeetingRepository.softDelete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Sectorial meeting with ID ${id} not found`);
        }
    }

    // --- Agenda Points ---

    async createAgenda(meetingId: number, createDto: CreateSectorialAgendaDto, userId: number): Promise<SectorialAgenda> {
        // Ensure meeting exists
        await this.findOne(meetingId);

        const agenda = this.sectorialAgendaRepository.create({
            ...createDto,
            sectorialMeetingId: meetingId,
            createdBy: userId,
            modifiedBy: userId,
            departments: createDto.departmentIds ? createDto.departmentIds.map(id => ({ id } as any)) : [],
        });
        return this.sectorialAgendaRepository.save(agenda);
    }

    async getAgendaPoints(meetingId: number): Promise<SectorialAgenda[]> {
        return this.sectorialAgendaRepository.find({
            where: { sectorialMeetingId: meetingId },
            relations: ['departments', 'replies'],
            order: { createdAt: 'ASC' }
        });
    }

    async getAgendaPoint(pointId: number): Promise<SectorialAgenda> {
        const point = await this.sectorialAgendaRepository.findOne({
            where: { id: pointId },
            relations: ['departments', 'replies']
        });

        if (!point) {
            throw new NotFoundException(`Agenda point with ID ${pointId} not found`);
        }
        return point;
    }

    async updateAgendaPoint(pointId: number, updateDto: UpdateSectorialAgendaDto, userId: number): Promise<SectorialAgenda> {
        const point = await this.getAgendaPoint(pointId);

        // Handle department updates if provided
        if (updateDto.departmentIds) {
            point.departments = updateDto.departmentIds.map(id => ({ id } as any));
            delete updateDto.departmentIds;
        }

        this.sectorialAgendaRepository.merge(point, {
            ...updateDto,
            modifiedBy: userId
        });
        return this.sectorialAgendaRepository.save(point);
    }

    async removeAgendaPoint(pointId: number): Promise<void> {
        const result = await this.sectorialAgendaRepository.softDelete(pointId);
        if (result.affected === 0) {
            throw new NotFoundException(`Agenda point with ID ${pointId} not found`);
        }
    }

    // --- Replies ---

    async getAgendaReplies(pointId: number): Promise<SectorialAgendaReply[]> {
        return this.sectorialAgendaReplyRepository.find({
            where: { sectorialAgendaId: pointId },
            order: { createdAt: 'ASC' }
        });
    }

    async addAgendaReply(pointId: number, replyDto: CreateSectorialReplyDto, userId: number): Promise<SectorialAgendaReply> {
        await this.getAgendaPoint(pointId); // Ensure point exists

        const reply = this.sectorialAgendaReplyRepository.create({
            ...replyDto,
            sectorialAgendaId: pointId,
            createdBy: userId,
            modifiedBy: userId
        });
        return this.sectorialAgendaReplyRepository.save(reply);
    }
}
