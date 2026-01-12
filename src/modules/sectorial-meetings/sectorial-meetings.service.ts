import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SectorialMeeting } from './entities/sectorial-meeting.entity';
import { CreateSectorialMeetingDto } from './dto/create-sectorial-meeting.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class SectorialMeetingsService {
    constructor(
        @InjectRepository(SectorialMeeting)
        private sectorialMeetingRepository: Repository<SectorialMeeting>,
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
}
