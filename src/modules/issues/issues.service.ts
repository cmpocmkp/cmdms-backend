import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue } from './entities/issue.entity';
import { IssueHistory } from './entities/issue-history.entity';
import { CreateIssueDto } from './dto/create-issue.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IssueStatus } from '../../common/enums';

@Injectable()
export class IssuesService {
  constructor(
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,
    @InjectRepository(IssueHistory)
    private historyRepository: Repository<IssueHistory>,
  ) {}

  async create(createIssueDto: CreateIssueDto, createdBy: number): Promise<Issue> {
    const issue = this.issueRepository.create({
      ...createIssueDto,
      status: IssueStatus.NEW,
      createdBy,
    });
    const savedIssue = await this.issueRepository.save(issue);

    // Create initial history entry
    await this.addHistory(savedIssue.id, 'created', createdBy, { remarks: 'Issue created' });

    return savedIssue;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.issueRepository.findAndCount({
      skip,
      take: limit,
      relations: ['district', 'primaryDepartment', 'history'],
      where: { isArchived: false },
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      metadata: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number): Promise<Issue> {
    const issue = await this.issueRepository.findOne({
      where: { id },
      relations: ['district', 'primaryDepartment', 'history', 'history.user', 'history.department'],
    });

    if (!issue) {
      throw new NotFoundException(`Issue with ID ${id} not found`);
    }

    return issue;
  }

  async updateStatus(id: number, status: IssueStatus, userId: number, remarks?: string): Promise<Issue> {
    const issue = await this.findOne(id);
    issue.status = status;
    issue.modifiedBy = userId;
    
    const savedIssue = await this.issueRepository.save(issue);

    // Log status change
    await this.addHistory(id, 'status_changed', userId, { status, remarks });

    return savedIssue;
  }

  async assignDepartment(id: number, departmentId: number, userId: number, remarks?: string): Promise<Issue> {
    const issue = await this.findOne(id);
    issue.primaryDepartmentId = departmentId;
    issue.status = IssueStatus.ASSIGNED;
    issue.modifiedBy = userId;

    const savedIssue = await this.issueRepository.save(issue);

    // Log assignment
    await this.addHistory(id, 'assigned', userId, { departmentId, remarks });

    return savedIssue;
  }

  private async addHistory(issueId: number, actionType: string, userId: number, data: any): Promise<void> {
    const history = this.historyRepository.create({
      issueId,
      actionType,
      userId,
      actionDate: new Date(),
      ...data,
    });
    await this.historyRepository.save(history);
  }
}

