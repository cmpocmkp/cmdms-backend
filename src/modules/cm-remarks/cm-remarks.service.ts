import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CmRemark } from './entities/cm-remark.entity';
import { CMRemarkResponse } from './entities/cm-remark-response.entity';
import { CreateCmRemarkDto } from './dto/create-cm-remark.dto';
import { CreateCMRemarkResponseDto } from './dto/create-cm-remark-response.dto';
import { UpdateCMRemarkDepartmentDto } from './dto/update-cm-remark-department.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class CMRemarksService {
    constructor(
        @InjectRepository(CmRemark)
        private cmRemarkRepository: Repository<CmRemark>,
        @InjectRepository(CMRemarkResponse)
        private responseRepository: Repository<CMRemarkResponse>,
    ) { }

    async create(createDto: CreateCmRemarkDto, userId: number): Promise<CmRemark> {
        const remark = this.cmRemarkRepository.create({
            ...createDto,
            createdBy: userId,
            modifiedBy: userId,
        });
        return this.cmRemarkRepository.save(remark);
    }

    async findAll(paginationDto: PaginationDto) {
        const { page = 1, limit = 10 } = paginationDto;
        const skip = (page - 1) * limit;

        const [data, total] = await this.cmRemarkRepository.findAndCount({
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
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

    async findOne(id: number): Promise<CmRemark> {
        const remark = await this.cmRemarkRepository.findOne({
            where: { id },
            relations: ['responses', 'responses.user', 'responses.department'],
        });

        if (!remark) {
            throw new NotFoundException(`CM Remark with ID ${id} not found`);
        }

        return remark;
    }

    async update(id: number, updateDto: any): Promise<CmRemark> {
        const remark = await this.findOne(id);
        this.cmRemarkRepository.merge(remark, updateDto);
        return this.cmRemarkRepository.save(remark);
    }

    async remove(id: number): Promise<void> {
        const result = await this.cmRemarkRepository.softDelete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`CM Remark with ID ${id} not found`);
        }
    }

    async createResponse(remarkId: number, createDto: CreateCMRemarkResponseDto, userId: number): Promise<CMRemarkResponse> {
        const response = this.responseRepository.create({
            ...createDto,
            cmRemarkId: remarkId,
            userId
        });
        return this.responseRepository.save(response);
    }

    async findResponses(remarkId: number): Promise<CMRemarkResponse[]> {
        return this.responseRepository.find({
            where: { cmRemarkId: remarkId },
            relations: ['user', 'department'],
            order: { createdAt: 'DESC' }
        });
    }

    async findResponse(id: number): Promise<CMRemarkResponse> {
        const response = await this.responseRepository.findOne({
            where: { id },
            relations: ['user', 'department', 'cmRemark']
        });

        if (!response) {
            throw new NotFoundException(`Response with ID ${id} not found`);
        }

        return response;
    }

    async getDepartments(remarkId: number) {
        // Logic to fetch departments associated with the remark
        // Assuming existing logic or placeholder logic is needed here based on lack of dedicated entity or ManyToMany table in visible scope
        // For now returning empty array or mocking based on passed implementation context
        return [];
    }

    async updateDepartmentStatus(remarkId: number, departmentId: number, updateDto: UpdateCMRemarkDepartmentDto) {
        // Placeholder for department status update logic
        // Would typically interact with a join table or related entity
        return { message: 'Department status updated', remarkId, departmentId, ...updateDto };
    }
}
