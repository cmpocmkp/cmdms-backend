import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PtfIssue } from './entities/ptf-issue.entity';
import { PtfHistory } from './entities/ptf-history.entity';
import { PtfResponse } from './entities/ptf-response.entity';
import { PtfMeeting } from './entities/ptf-meeting.entity';
import { IssueStatus } from '../../common/enums';

@Injectable()
export class PtfService {
  constructor(
    @InjectRepository(PtfIssue)
    private ptfIssueRepository: Repository<PtfIssue>,
    @InjectRepository(PtfHistory)
    private historyRepository: Repository<PtfHistory>,
    @InjectRepository(PtfResponse)
    private responseRepository: Repository<PtfResponse>,
    @InjectRepository(PtfMeeting)
    private meetingRepository: Repository<PtfMeeting>,
  ) {}

  async createIssue(issueData: any, createdBy: number): Promise<PtfIssue> {
    const issue = this.ptfIssueRepository.create({
      ...issueData,
      createdBy,
    });
    const savedIssue = await this.ptfIssueRepository.save(issue) as unknown as PtfIssue;

    await this.addHistory(savedIssue.id, 'created', createdBy, { remarks: 'PTF issue created' });

    return savedIssue;
  }

  async findAll(filters?: any) {
    const query = this.ptfIssueRepository.createQueryBuilder('issue')
      .leftJoinAndSelect('issue.district', 'district')
      .leftJoinAndSelect('issue.primaryDepartment', 'primaryDepartment')
      .where('issue.isClosed = :isClosed', { isClosed: false })
      .orderBy('issue.createdAt', 'DESC');

    if (filters?.districtId) {
      query.andWhere('issue.districtId = :districtId', { districtId: filters.districtId });
    }

    if (filters?.departmentId) {
      query.andWhere('issue.primaryDepartmentId = :departmentId', { departmentId: filters.departmentId });
    }

    return await query.getMany();
  }

  async findOne(id: number): Promise<PtfIssue> {
    const issue = await this.ptfIssueRepository.findOne({
      where: { id },
      relations: ['district', 'primaryDepartment', 'history', 'history.user', 'history.department', 'responses'],
    });

    if (!issue) {
      throw new NotFoundException(`PTF Issue with ID ${id} not found`);
    }

    return issue;
  }

  async updateStatus(id: number, status: IssueStatus, userId: number, remarks?: string): Promise<PtfIssue> {
    const issue = await this.findOne(id);
    issue.status = status;
    issue.modifiedBy = userId;
    
    const savedIssue = await this.ptfIssueRepository.save(issue);
    await this.addHistory(id, 'status_changed', userId, { status, remarks });

    return savedIssue;
  }

  async recordCmDecision(id: number, decision: string, userId: number, newTimeline?: Date, newDepartment?: number): Promise<PtfIssue> {
    const issue = await this.findOne(id);
    
    if (newTimeline) {
      issue.timeline = newTimeline;
    }
    
    if (newDepartment) {
      issue.primaryDepartmentId = newDepartment;
    }
    
    issue.modifiedBy = userId;
    
    const savedIssue = await this.ptfIssueRepository.save(issue);
    await this.addHistory(id, 'cm_decision', userId, { cmDecision: decision });

    return savedIssue;
  }

  async closeIssue(id: number, userId: number, remarks: string): Promise<PtfIssue> {
    const issue = await this.findOne(id);
    issue.isClosed = true;
    issue.status = IssueStatus.CLOSED;
    issue.modifiedBy = userId;
    
    const savedIssue = await this.ptfIssueRepository.save(issue);
    await this.addHistory(id, 'closed', userId, { remarks });

    return savedIssue;
  }

  async submitResponse(issueId: number, departmentId: number, userId: number, response: string): Promise<PtfResponse> {
    const ptfResponse = this.responseRepository.create({
      ptfIssueId: issueId,
      departmentId,
      userId,
      response,
    });
    return await this.responseRepository.save(ptfResponse);
  }

  async createMeeting(meetingData: any, createdBy: number): Promise<PtfMeeting> {
    const meeting = this.meetingRepository.create({
      ...meetingData,
      createdBy,
    });
    return await this.meetingRepository.save(meeting) as unknown as PtfMeeting;
  }

  private async addHistory(issueId: number, actionType: string, userId: number, data: any): Promise<void> {
    const history = this.historyRepository.create({
      ptfIssueId: issueId,
      actionType,
      userId,
      actionDate: new Date(),
      ...data,
    });
    await this.historyRepository.save(history);
  }
}

