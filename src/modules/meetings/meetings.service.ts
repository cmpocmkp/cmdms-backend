import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from './entities/meeting.entity';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,
  ) {}

  async create(createMeetingDto: CreateMeetingDto, createdBy: number): Promise<Meeting> {
    const meeting = this.meetingRepository.create({
      ...createMeetingDto,
      createdBy,
    });
    return await this.meetingRepository.save(meeting);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, sort = 'id', order = 'DESC' } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.meetingRepository.findAndCount({
      skip,
      take: limit,
      order: { [sort]: order },
      relations: ['department', 'meetingType'],
    });

    return {
      data,
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: number): Promise<Meeting> {
    const meeting = await this.meetingRepository.findOne({
      where: { id },
      relations: ['department', 'meetingType', 'minutes'],
    });

    if (!meeting) {
      throw new NotFoundException(`Meeting with ID ${id} not found`);
    }

    return meeting;
  }

  async update(id: number, updateMeetingDto: UpdateMeetingDto, modifiedBy: number): Promise<Meeting> {
    const meeting = await this.findOne(id);
    Object.assign(meeting, updateMeetingDto, { modifiedBy });
    return await this.meetingRepository.save(meeting);
  }

  async remove(id: number): Promise<void> {
    const meeting = await this.findOne(id);
    await this.meetingRepository.remove(meeting);
  }
}

