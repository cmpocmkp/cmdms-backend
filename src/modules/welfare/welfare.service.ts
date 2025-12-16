import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WelfareInitiative } from './entities/welfare-initiative.entity';

@Injectable()
export class WelfareService {
  constructor(
    @InjectRepository(WelfareInitiative)
    private welfareRepository: Repository<WelfareInitiative>,
  ) {}

  async create(createDto: any, userId: number): Promise<WelfareInitiative> {
    const initiative = this.welfareRepository.create({ ...createDto, createdBy: userId });
    return await this.welfareRepository.save(initiative) as unknown as WelfareInitiative;
  }

  async findAll(): Promise<WelfareInitiative[]> {
    return await this.welfareRepository.find({ relations: ['district'] });
  }

  async findOne(id: number): Promise<WelfareInitiative> {
    const initiative = await this.welfareRepository.findOne({ where: { id }, relations: ['district'] });
    if (!initiative) throw new NotFoundException(`Welfare initiative ${id} not found`);
    return initiative;
  }

  async update(id: number, updateDto: any): Promise<WelfareInitiative> {
    const initiative = await this.findOne(id);
    Object.assign(initiative, updateDto);
    return await this.welfareRepository.save(initiative);
  }

  async remove(id: number): Promise<void> {
    const initiative = await this.findOne(id);
    await this.welfareRepository.remove(initiative);
  }
}

