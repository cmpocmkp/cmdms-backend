import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Kpi } from './entities/kpi.entity';
import { KpiData } from './entities/kpi-data.entity';

@Injectable()
export class KpiService {
  constructor(
    @InjectRepository(Kpi)
    private kpiRepository: Repository<Kpi>,
    @InjectRepository(KpiData)
    private kpiDataRepository: Repository<KpiData>,
  ) {}

  async create(createKpiDto: any, createdBy: number): Promise<Kpi> {
    const kpi = this.kpiRepository.create({
      ...createKpiDto,
      createdBy,
    });
    return await this.kpiRepository.save(kpi) as unknown as Kpi;
  }

  async findAll(departmentId?: number): Promise<Kpi[]> {
    const where = departmentId ? { departmentId, isActive: true } : { isActive: true };
    return await this.kpiRepository.find({
      where,
      relations: ['department'],
    });
  }

  async findOne(id: number): Promise<Kpi> {
    const kpi = await this.kpiRepository.findOne({
      where: { id },
      relations: ['department', 'data'],
    });

    if (!kpi) {
      throw new NotFoundException(`KPI with ID ${id} not found`);
    }

    return kpi;
  }

  async submitData(kpiId: number, departmentId: number, userId: number, dataDto: any): Promise<KpiData> {
    const kpiData = this.kpiDataRepository.create({
      kpiId,
      departmentId,
      userId,
      ...dataDto,
    });
    return await this.kpiDataRepository.save(kpiData) as unknown as KpiData;
  }

  async getDataByKpi(kpiId: number, startDate?: Date, endDate?: Date): Promise<KpiData[]> {
    const query = this.kpiDataRepository.createQueryBuilder('data')
      .where('data.kpiId = :kpiId', { kpiId })
      .leftJoinAndSelect('data.department', 'department')
      .leftJoinAndSelect('data.user', 'user')
      .orderBy('data.date', 'DESC');

    if (startDate) {
      query.andWhere('data.date >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('data.date <= :endDate', { endDate });
    }

    return await query.getMany();
  }
}

