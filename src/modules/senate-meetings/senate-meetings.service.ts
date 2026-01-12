import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SenateMeeting } from './entities/senate-meeting.entity';
import { CreateSenateMeetingDto } from './dto/create-senate-meeting.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class SenateMeetingsService {
    constructor(
        @InjectRepository(SenateMeeting)
        private senateMeetingRepository: Repository<SenateMeeting>,
    ) { }

    async create(createDto: CreateSenateMeetingDto, userId: number): Promise<SenateMeeting> {
        const meeting = this.senateMeetingRepository.create({
            ...createDto,
            createdBy: userId,
            modifiedBy: userId
        });
        return this.senateMeetingRepository.save(meeting);
    }

    async findAll(paginationDto: PaginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;

        const [data, total] = await this.senateMeetingRepository.findAndCount({
            skip,
            take: limit,
            order: { date: 'DESC' },
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

    async findOne(id: number): Promise<SenateMeeting> {
        const meeting = await this.senateMeetingRepository.findOne({
            where: { id },
            relations: ['minutes']
        });

        if (!meeting) {
            throw new NotFoundException(`Senate meeting with ID ${id} not found`);
        }

        return meeting;
    }

    async update(id: number, updateDto: any): Promise<SenateMeeting> {
        const meeting = await this.findOne(id);
        this.senateMeetingRepository.merge(meeting, updateDto);
        return this.senateMeetingRepository.save(meeting);
    }

    async remove(id: number): Promise<void> {
        const result = await this.senateMeetingRepository.softDelete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Senate meeting with ID ${id} not found`);
        }
    }
}
