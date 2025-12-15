import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnualScheme } from './entities/annual-scheme.entity';
import { SchemeCosting } from './entities/scheme-costing.entity';
import { SchemeBudget } from './entities/scheme-budget.entity';
import { SchemeExpenditure } from './entities/scheme-expenditure.entity';
import { SchemeRevision } from './entities/scheme-revision.entity';

@Injectable()
export class SchemesService {
  constructor(
    @InjectRepository(AnnualScheme)
    private schemeRepository: Repository<AnnualScheme>,
    @InjectRepository(SchemeCosting)
    private costingRepository: Repository<SchemeCosting>,
    @InjectRepository(SchemeBudget)
    private budgetRepository: Repository<SchemeBudget>,
    @InjectRepository(SchemeExpenditure)
    private expenditureRepository: Repository<SchemeExpenditure>,
    @InjectRepository(SchemeRevision)
    private revisionRepository: Repository<SchemeRevision>,
  ) {}

  async createScheme(schemeData: any, createdBy: number): Promise<AnnualScheme> {
    const scheme = this.schemeRepository.create({
      ...schemeData,
      createdBy,
    });
    return await this.schemeRepository.save(scheme) as unknown as AnnualScheme;
  }

  async findAll(filters?: any) {
    const query = this.schemeRepository.createQueryBuilder('scheme')
      .leftJoinAndSelect('scheme.department', 'department')
      .leftJoinAndSelect('scheme.district', 'district')
      .orderBy('scheme.createdAt', 'DESC');

    if (filters?.departmentId) {
      query.andWhere('scheme.departmentId = :departmentId', { departmentId: filters.departmentId });
    }

    if (filters?.districtId) {
      query.andWhere('scheme.districtId = :districtId', { districtId: filters.districtId });
    }

    if (filters?.type) {
      query.andWhere('scheme.type = :type', { type: filters.type });
    }

    if (filters?.status) {
      query.andWhere('scheme.status = :status', { status: filters.status });
    }

    return await query.getMany();
  }

  async findOne(id: number): Promise<AnnualScheme> {
    const scheme = await this.schemeRepository.findOne({
      where: { id },
      relations: ['department', 'district', 'costings', 'budgets', 'expenditures', 'revisions'],
    });

    if (!scheme) {
      throw new NotFoundException(`Scheme with ID ${id} not found`);
    }

    return scheme;
  }

  async addCosting(schemeId: number, costingData: any): Promise<SchemeCosting> {
    const costing = this.costingRepository.create({
      annualSchemeId: schemeId,
      ...costingData,
    });
    return await this.costingRepository.save(costing) as unknown as SchemeCosting;
  }

  async addBudget(schemeId: number, budgetData: any): Promise<SchemeBudget> {
    const budget = this.budgetRepository.create({
      annualSchemeId: schemeId,
      ...budgetData,
    });
    return await this.budgetRepository.save(budget) as unknown as SchemeBudget;
  }

  async addExpenditure(schemeId: number, expenditureData: any): Promise<SchemeExpenditure> {
    const expenditure = this.expenditureRepository.create({
      annualSchemeId: schemeId,
      ...expenditureData,
    });
    return await this.expenditureRepository.save(expenditure) as unknown as SchemeExpenditure;
  }

  async addRevision(schemeId: number, revisionData: any): Promise<SchemeRevision> {
    const revision = this.revisionRepository.create({
      annualSchemeId: schemeId,
      ...revisionData,
    });
    return await this.revisionRepository.save(revision) as unknown as SchemeRevision;
  }

  async getFinancialSummary(schemeId: number) {
    const scheme = await this.findOne(schemeId);
    
    const totalBudget = scheme.budgets.reduce((sum, b) => sum + Number(b.amount), 0);
    const totalExpenditure = scheme.expenditures.reduce((sum, e) => sum + Number(e.amount), 0);
    const balance = totalBudget - totalExpenditure;

    return {
      estimatedCost: scheme.estimatedCost,
      totalBudget,
      totalExpenditure,
      balance,
      utilizationPercentage: totalBudget > 0 ? (totalExpenditure / totalBudget) * 100 : 0,
    };
  }
}

