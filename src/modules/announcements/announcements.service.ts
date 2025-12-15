import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { AnnouncementDetail } from './entities/announcement-detail.entity';
import { AnnouncementResponse } from './entities/announcement-response.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementRepository: Repository<Announcement>,
    @InjectRepository(AnnouncementDetail)
    private detailRepository: Repository<AnnouncementDetail>,
    @InjectRepository(AnnouncementResponse)
    private responseRepository: Repository<AnnouncementResponse>,
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto, createdBy: number): Promise<Announcement> {
    const { details, ...announcementData } = createAnnouncementDto;

    const announcement = this.announcementRepository.create({
      ...announcementData,
      createdBy,
    });

    const savedAnnouncement = await this.announcementRepository.save(announcement);

    // Create details if provided
    if (details && details.length > 0) {
      for (const detail of details) {
        await this.detailRepository.save({
          ...detail,
          announcementId: savedAnnouncement.id,
          createdBy,
        });
      }
    }

    return savedAnnouncement;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.announcementRepository.findAndCount({
      skip,
      take: limit,
      relations: ['details', 'district'],
      where: { isArchived: false },
      order: { date: 'DESC' },
    });

    return {
      data,
      metadata: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
      relations: ['details', 'details.mainDepartment', 'details.otherDepartments', 'details.responses', 'district'],
    });

    if (!announcement) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }

    return announcement;
  }

  async update(id: number, updateAnnouncementDto: UpdateAnnouncementDto, modifiedBy: number): Promise<Announcement> {
    const announcement = await this.findOne(id);
    Object.assign(announcement, updateAnnouncementDto, { modifiedBy });
    return await this.announcementRepository.save(announcement);
  }

  async remove(id: number): Promise<void> {
    const announcement = await this.findOne(id);
    await this.announcementRepository.remove(announcement);
  }

  async submitResponse(detailId: number, departmentId: number, userId: number, response: string): Promise<AnnouncementResponse> {
    const announcementResponse = this.responseRepository.create({
      announcementDetailId: detailId,
      departmentId,
      userId,
      response,
    });
    return await this.responseRepository.save(announcementResponse);
  }
}

