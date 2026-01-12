import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PtfIssue } from './entities/ptf-issue.entity';
import { PtfHistory } from './entities/ptf-history.entity';
import { PtfResponse } from './entities/ptf-response.entity';
import { PtfMeeting } from './entities/ptf-meeting.entity';
import { IssueStatus } from '../../common/enums';
import { CreatePtfIssueDto } from './dto/create-ptf-issue.dto';
import { UpdatePtfIssueDto } from './dto/update-ptf-issue.dto';
import { CreatePtfMeetingDto } from './dto/create-ptf-meeting.dto';
import { UpdatePtfMeetingDto } from './dto/update-ptf-meeting.dto';

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
  ) { }

  async createIssue(issueData: CreatePtfIssueDto, createdBy: number): Promise<PtfIssue> {
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
      .leftJoinAndSelect('issue.responses', 'responses')
      .orderBy('issue.createdAt', 'DESC');

    if (filters?.districtId) {
      query.andWhere('issue.districtId = :districtId', { districtId: filters.districtId });
    }

    if (filters?.departmentId) {
      query.andWhere('issue.primaryDepartmentId = :departmentId', { departmentId: filters.departmentId });
    }

    // Default to show all issues unless specifically filtered for closed? 
    // The previous implementation hardcoded `isClosed = false`. 
    // If we want to show all including closed, we should allow a filter or default to all.
    // For now, let's keep showing open issues primarily if not specified, 
    // but the user might want to see history.
    // Preserving previous behavior but allowing override via filter if needed in future.
    if (!filters?.includeClosed) {
      query.andWhere('issue.isClosed = :isClosed', { isClosed: false });
    }

    const items = await query.getMany();
    // Return with a metadata structure if needed for pagination? The controller currently expects just array or logic there.
    // The previous service return `getMany()` which is an array.
    // The previous controller just returned `this.ptfService.findAll()`.
    // Let's wrapping it in a data property in the controller or here?
    // Let's stick to returning array here as per previous impl.
    // Wait, the previous impl used:
    // .where('issue.isClosed = :isClosed', { isClosed: false })
    // I made this optional based on filter, but defaulting to that behavior.

    return items;
  }

  async findOne(id: number): Promise<PtfIssue> {
    const issue = await this.ptfIssueRepository.findOne({
      where: { id },
      relations: ['district', 'primaryDepartment', 'history', 'history.user', 'history.department', 'responses', 'responses.user', 'responses.department'],
    });

    if (!issue) {
      throw new NotFoundException(`PTF Issue with ID ${id} not found`);
    }

    return issue;
  }

  async updateIssue(id: number, updateDto: UpdatePtfIssueDto, userId: number): Promise<PtfIssue> {
    const issue = await this.findOne(id);

    // Create mapping of changes for history
    const changes: any = {};
    Object.keys(updateDto).forEach(key => {
      const typedKey = key as keyof UpdatePtfIssueDto;
      if (updateDto[typedKey] !== (issue as any)[key]) {
        changes[key] = { from: (issue as any)[key], to: updateDto[typedKey] };
      }
    });

    Object.assign(issue, updateDto);
    issue.modifiedBy = userId;

    const savedIssue = await this.ptfIssueRepository.save(issue);

    if (Object.keys(changes).length > 0) {
      await this.addHistory(id, 'updated', userId, { changes });
    }

    return savedIssue;
  }

  async removeIssue(id: number): Promise<void> {
    const result = await this.ptfIssueRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`PTF Issue with ID ${id} not found`);
    }
  }

  async updateStatus(id: number, status: IssueStatus, userId: number, remarks?: string): Promise<PtfIssue> {
    const issue = await this.findOne(id);
    const oldStatus = issue.status;

    issue.status = status;
    issue.modifiedBy = userId;

    // Check if status implies closed.
    if (status === IssueStatus.CLOSED || status === IssueStatus.RESOLVED) {
      issue.isClosed = true;
    } else {
      issue.isClosed = false;
    }

    const savedIssue = await this.ptfIssueRepository.save(issue);
    await this.addHistory(id, 'status_changed', userId, { from: oldStatus, to: status, remarks });

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

  async getResponses(issueId: number): Promise<PtfResponse[]> {
    return this.responseRepository.find({
      where: { ptfIssueId: issueId },
      relations: ['user', 'department', 'user.department'],
      order: { createdAt: 'ASC' }
    });
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

  // Meetings

  async createMeeting(meetingData: CreatePtfMeetingDto, createdBy: number): Promise<PtfMeeting> {
    const meeting = this.meetingRepository.create({
      ...meetingData,
      createdBy,
    });

    // If issueIds are provided, we would need to fetch them and assign to meeting.issues
    // Using `issues` relation if defined in DTO logic or manually handling:
    if (meetingData.issueIds && meetingData.issueIds.length > 0) {
      // We need to fetch issues to set the relation
      const issues = await this.ptfIssueRepository.findByIds(meetingData.issueIds);
      meeting.issues = issues;
    }

    return await this.meetingRepository.save(meeting) as unknown as PtfMeeting;
  }

  async findAllMeetings(): Promise<PtfMeeting[]> {
    return this.meetingRepository.find({
      order: { date: 'DESC' },
      relations: ['issues']
    });
  }

  async findOneMeeting(id: number): Promise<PtfMeeting> {
    const meeting = await this.meetingRepository.findOne({
      where: { id },
      relations: ['issues'],
    });

    if (!meeting) {
      throw new NotFoundException(`PTF Meeting with ID ${id} not found`);
    }

    return meeting;
  }

  async updateMeeting(id: number, updateDto: UpdatePtfMeetingDto, userId: number): Promise<PtfMeeting> {
    const meeting = await this.findOneMeeting(id);

    if (updateDto.issueIds) {
      const issues = await this.ptfIssueRepository.findByIds(updateDto.issueIds);
      meeting.issues = issues;
      delete updateDto.issueIds; // Remove to avoid overwriting with non-entity property
    }

    Object.assign(meeting, updateDto);
    meeting.modifiedBy = userId;

    return this.meetingRepository.save(meeting);
  }

  async removeMeeting(id: number): Promise<void> {
    const result = await this.meetingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`PTF Meeting with ID ${id} not found`);
    }
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

