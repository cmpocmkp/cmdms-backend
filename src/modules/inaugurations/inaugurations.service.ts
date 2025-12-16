import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inauguration } from './entities/inauguration.entity';

@Injectable()
export class InaugurationsService {
  constructor(
    @InjectRepository(Inauguration)
    private inaugurationsRepository: Repository<Inauguration>,
  ) {}

  async create(createDto: any, userId: number): Promise<Inauguration> {
    const inauguration = this.inaugurationsRepository.create({ ...createDto, createdBy: userId });
    return await this.inaugurationsRepository.save(inauguration) as unknown as Inauguration;
  }

  async findAll(): Promise<Inauguration[]> {
    return await this.inaugurationsRepository.find({ relations: ['district', 'department'], order: { date: 'DESC' } });
  }

  async findOne(id: number): Promise<Inauguration> {
    const inauguration = await this.inaugurationsRepository.findOne({ where: { id }, relations: ['district', 'department'] });
    if (!inauguration) throw new NotFoundException(`Inauguration ${id} not found`);
    return inauguration;
  }

  async update(id: number, updateDto: any): Promise<Inauguration> {
    const inauguration = await this.findOne(id);
    Object.assign(inauguration, updateDto);
    return await this.inaugurationsRepository.save(inauguration);
  }

  async remove(id: number): Promise<void> {
    const inauguration = await this.findOne(id);
    await this.inaugurationsRepository.remove(inauguration);
  }
}

