import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Complaint } from './entities/complaint.entity';
import { ComplaintResponse } from './entities/complaint-response.entity';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private complaintRepository: Repository<Complaint>,
    @InjectRepository(ComplaintResponse)
    private responseRepository: Repository<ComplaintResponse>,
  ) {}

  async create(createComplaintDto: CreateComplaintDto, createdBy: number | null): Promise<Complaint> {
    const complaint = this.complaintRepository.create({
      ...createComplaintDto,
      status: 'new',
      createdBy: createdBy || undefined,
    });
    return await this.complaintRepository.save(complaint);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.complaintRepository.findAndCount({
      skip,
      take: limit,
      relations: ['department', 'district', 'responses'],
      where: { isArchived: false },
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      metadata: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number): Promise<Complaint> {
    const complaint = await this.complaintRepository.findOne({
      where: { id },
      relations: ['department', 'district', 'responses', 'responses.user', 'responses.department'],
    });

    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }

    return complaint;
  }

  async updateStatus(id: number, status: string, modifiedBy: number): Promise<Complaint> {
    const complaint = await this.findOne(id);
    complaint.status = status;
    complaint.modifiedBy = modifiedBy;
    return await this.complaintRepository.save(complaint);
  }

  async submitResponse(complaintId: number, departmentId: number, userId: number, responseData: any): Promise<ComplaintResponse> {
    const response = this.responseRepository.create({
      complaintId,
      departmentId,
      userId,
      ...responseData,
    });
    return await this.responseRepository.save(response) as unknown as ComplaintResponse;
  }

  async submitFeedback(id: number, rating: number, feedback: string): Promise<Complaint> {
    const complaint = await this.findOne(id);
    complaint.satisfactionRating = rating;
    complaint.citizenFeedback = feedback;
    return await this.complaintRepository.save(complaint);
  }
}

