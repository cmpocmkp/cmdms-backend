import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Directive } from './entities/directive.entity';
import { DirectiveResponse } from './entities/directive-response.entity';
import { CreateDirectiveDto } from './dto/create-directive.dto';
import { UpdateDirectiveDto } from './dto/update-directive.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class DirectivesService {
  constructor(
    @InjectRepository(Directive)
    private directiveRepository: Repository<Directive>,
    @InjectRepository(DirectiveResponse)
    private responseRepository: Repository<DirectiveResponse>,
  ) {}

  async create(createDirectiveDto: CreateDirectiveDto, createdBy: number): Promise<Directive> {
    const { departments: _, ...directiveData } = createDirectiveDto;
    const directive = this.directiveRepository.create({
      ...directiveData,
      createdBy,
    } as any);
    return await this.directiveRepository.save(directive) as unknown as Directive;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.directiveRepository.findAndCount({
      skip,
      take: limit,
      relations: ['departments', 'responses'],
      where: { isArchived: false },
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      metadata: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number): Promise<Directive> {
    const directive = await this.directiveRepository.findOne({
      where: { id },
      relations: ['departments', 'responses', 'responses.department', 'responses.user'],
    });

    if (!directive) {
      throw new NotFoundException(`Directive with ID ${id} not found`);
    }

    return directive;
  }

  async update(id: number, updateDirectiveDto: UpdateDirectiveDto, modifiedBy: number): Promise<Directive> {
    const directive = await this.findOne(id);
    Object.assign(directive, updateDirectiveDto, { modifiedBy });
    return await this.directiveRepository.save(directive);
  }

  async remove(id: number): Promise<void> {
    const directive = await this.findOne(id);
    await this.directiveRepository.remove(directive);
  }

  async submitResponse(directiveId: number, departmentId: number, userId: number, response: string): Promise<DirectiveResponse> {
    const directiveResponse = this.responseRepository.create({
      directiveId,
      departmentId,
      userId,
      response,
    });
    return await this.responseRepository.save(directiveResponse);
  }
}

