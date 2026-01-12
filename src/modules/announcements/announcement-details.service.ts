import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnouncementDetail } from './entities/announcement-detail.entity';
import { AnnouncementResponse } from './entities/announcement-response.entity';
import { CreateAnnouncementDetailDto } from './dto/create-announcement-detail.dto';
import { Department } from '../departments/entities/department.entity';

@Injectable()
export class AnnouncementDetailsService {
    constructor(
        @InjectRepository(AnnouncementDetail)
        private detailRepository: Repository<AnnouncementDetail>,
        @InjectRepository(AnnouncementResponse)
        private responseRepository: Repository<AnnouncementResponse>,
    ) { }

    async findAllByAnnouncementId(announcementId: number): Promise<AnnouncementDetail[]> {
        return this.detailRepository.find({
            where: { announcementId },
            relations: ['mainDepartment', 'otherDepartments', 'responses'],
        });
    }

    async findOne(id: number): Promise<AnnouncementDetail> {
        const detail = await this.detailRepository.findOne({
            where: { id },
            relations: ['mainDepartment', 'otherDepartments', 'responses'],
        });

        if (!detail) {
            throw new NotFoundException(`Announcement detail with ID ${id} not found`);
        }

        return detail;
    }

    async create(announcementId: number, createDto: CreateAnnouncementDetailDto, userId: number): Promise<AnnouncementDetail> {
        const { otherDepartmentIds, ...detailData } = createDto;

        const detail = this.detailRepository.create({
            ...detailData,
            announcementId,
            createdBy: userId,
            modifiedBy: userId,
        });

        if (otherDepartmentIds && otherDepartmentIds.length > 0) {
            detail.otherDepartments = otherDepartmentIds.map(id => ({ id } as Department));
        }

        return this.detailRepository.save(detail);
    }

    async update(id: number, updateDto: any): Promise<AnnouncementDetail> {
        const detail = await this.findOne(id);
        const { otherDepartmentIds, ...updateData } = updateDto;

        this.detailRepository.merge(detail, updateData);

        if (otherDepartmentIds) {
            detail.otherDepartments = otherDepartmentIds.map((id: number) => ({ id } as Department));
        }

        return this.detailRepository.save(detail);
    }

    async remove(id: number): Promise<void> {
        const result = await this.detailRepository.softDelete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Announcement detail with ID ${id} not found`);
        }
    }

    async findResponses(detailId: number): Promise<AnnouncementResponse[]> {
        return this.responseRepository.find({
            where: { announcementDetailId: detailId },
            relations: ['department', 'user'],
            order: { createdAt: 'DESC' },
        });
    }

    async findResponse(id: number): Promise<AnnouncementResponse> {
        const response = await this.responseRepository.findOne({
            where: { id },
            relations: ['department', 'user', 'announcementDetail'],
        });

        if (!response) {
            throw new NotFoundException(`Response with ID ${id} not found`);
        }

        return response;
    }
}
