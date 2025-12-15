import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Minute } from './entities/minute.entity';
import { Reply } from './entities/reply.entity';
import { CreateMinuteDto } from './dto/create-minute.dto';
import { UpdateMinuteDto } from './dto/update-minute.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { DecisionStatus } from '../../common/enums';

@Injectable()
export class MinutesService {
  constructor(
    @InjectRepository(Minute)
    private minuteRepository: Repository<Minute>,
    @InjectRepository(Reply)
    private replyRepository: Repository<Reply>,
  ) {}

  async create(createMinuteDto: CreateMinuteDto, createdBy: number): Promise<Minute> {
    const { departments, ...minuteData } = createMinuteDto;

    const minute = this.minuteRepository.create({
      ...minuteData,
      status: createMinuteDto.status || DecisionStatus.ON_TARGET,
      completed: createMinuteDto.status === DecisionStatus.COMPLETED ? 'Yes' : 'No',
      createdBy,
    });

    const savedMinute = await this.minuteRepository.save(minute);

    // Assign departments (in real implementation, handle pivot table)
    // For now, we'll just save the minute

    return savedMinute;
  }

  async findByMeeting(meetingId: number) {
    return await this.minuteRepository.find({
      where: { meetingId },
      relations: ['departments', 'replies'],
      order: { sortOrder: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Minute> {
    const minute = await this.minuteRepository.findOne({
      where: { id },
      relations: ['meeting', 'departments', 'replies', 'letters'],
    });

    if (!minute) {
      throw new NotFoundException(`Minute with ID ${id} not found`);
    }

    return minute;
  }

  async update(id: number, updateMinuteDto: UpdateMinuteDto, modifiedBy: number): Promise<Minute> {
    const minute = await this.findOne(id);
    
    Object.assign(minute, updateMinuteDto, { modifiedBy });
    
    if (updateMinuteDto.status === DecisionStatus.COMPLETED) {
      minute.completed = 'Yes';
    }

    return await this.minuteRepository.save(minute);
  }

  async remove(id: number): Promise<void> {
    const minute = await this.findOne(id);
    await this.minuteRepository.remove(minute);
  }

  async archive(id: number): Promise<Minute> {
    const minute = await this.findOne(id);
    minute.isArchived = true;
    return await this.minuteRepository.save(minute);
  }

  async createReply(createReplyDto: CreateReplyDto, userId: number, departmentId: number): Promise<Reply> {
    const reply = this.replyRepository.create({
      ...createReplyDto,
      userId,
      departmentId,
    });
    return await this.replyRepository.save(reply);
  }

  async findReplies(minuteId: number): Promise<Reply[]> {
    return await this.replyRepository.find({
      where: { minuteId },
      relations: ['user', 'department'],
      order: { createdAt: 'ASC' },
    });
  }
}

