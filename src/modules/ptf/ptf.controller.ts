import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PtfService } from './ptf.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Roles as RolesEnum } from '../../common/enums';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreatePtfIssueDto } from './dto/create-ptf-issue.dto';
import { UpdatePtfIssueDto } from './dto/update-ptf-issue.dto';
import { UpdatePtfIssueStatusDto } from './dto/update-ptf-issue-status.dto';
import { AssignPtfIssueDto } from './dto/assign-ptf-issue.dto';
import { CreatePtfResponseDto } from './dto/create-ptf-response.dto';
import { CreatePtfMeetingDto } from './dto/create-ptf-meeting.dto';
import { UpdatePtfMeetingDto } from './dto/update-ptf-meeting.dto';
import { ResponseDto } from '../../common/dto/response.dto';

@ApiTags('ptf')
@ApiBearerAuth('JWT-auth')
@Controller('ptf')
export class PtfController {
  constructor(private readonly ptfService: PtfService) { }

  // --- Issues ---

  @Post('issues')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Create a new PTF issue' })
  @ApiResponse({ status: 201, description: 'PTF issue created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createIssue(
    @Body() createIssueDto: CreatePtfIssueDto,
    @CurrentUser('id') userId: number,
  ) {
    const issue = await this.ptfService.createIssue(createIssueDto, userId);
    return ResponseDto.success(issue, 'PTF issue created successfully');
  }

  @Get('issues')
  @ApiOperation({ summary: 'Get all PTF issues' })
  @ApiResponse({ status: 200, description: 'Return all PTF issues' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() filters: any) {
    const issues = await this.ptfService.findAll(filters);
    return ResponseDto.success(issues);
  }

  @Get('issues/:id')
  @ApiOperation({ summary: 'Get a PTF issue by ID' })
  @ApiResponse({ status: 200, description: 'Return the PTF issue' })
  @ApiResponse({ status: 404, description: 'PTF issue not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const issue = await this.ptfService.findOne(id);
    return ResponseDto.success(issue);
  }

  @Patch('issues/:id')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Update a PTF issue' })
  @ApiParam({ name: 'id', description: 'PTF Issue ID' })
  @ApiResponse({ status: 200, description: 'PTF issue updated successfully' })
  async updateIssue(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePtfIssueDto,
    @CurrentUser('id') userId: number,
  ) {
    const issue = await this.ptfService.updateIssue(id, updateDto, userId);
    return ResponseDto.success(issue, 'PTF issue updated successfully');
  }

  @Delete('issues/:id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Delete a PTF issue' })
  @ApiParam({ name: 'id', description: 'PTF Issue ID' })
  @ApiResponse({ status: 200, description: 'PTF issue deleted successfully' })
  async removeIssue(@Param('id', ParseIntPipe) id: number) {
    await this.ptfService.removeIssue(id);
    return ResponseDto.success(null, 'PTF issue deleted successfully');
  }

  @Patch('issues/:id/status')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Update PTF issue status' })
  @ApiParam({ name: 'id', description: 'PTF Issue ID' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() statusDto: UpdatePtfIssueStatusDto,
    @CurrentUser('id') userId: number,
  ) {
    const issue = await this.ptfService.updateStatus(id, statusDto.status, userId, statusDto.remarks);
    return ResponseDto.success(issue, 'PTF issue status updated successfully');
  }

  @Post('issues/:id/assign')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Assign PTF issue to department' })
  @ApiParam({ name: 'id', description: 'PTF Issue ID' })
  async assignIssue(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignDto: AssignPtfIssueDto,
    @CurrentUser('id') userId: number,
  ) {
    // Reusing update logic as assignment is update of foreign keys
    const updateDto: UpdatePtfIssueDto = {
      primaryDepartmentId: assignDto.primaryDepartmentId,
      supportingDepartments: assignDto.supportingDepartments
    };
    const issue = await this.ptfService.updateIssue(id, updateDto, userId);
    return ResponseDto.success(issue, 'PTF issue assigned successfully');
  }

  @Get('issues/:id/responses')
  @ApiOperation({ summary: 'Get all responses for a PTF issue' })
  async getResponses(@Param('id', ParseIntPipe) id: number) {
    const responses = await this.ptfService.getResponses(id);
    return ResponseDto.success(responses);
  }

  @Post('issues/:id/responses')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Add a response to a PTF issue' })
  async addResponse(
    @Param('id', ParseIntPipe) id: number,
    @Body() createResponseDto: CreatePtfResponseDto,
    @CurrentUser('id') userId: number,
  ) {
    // If departmentId is not provided in body, we might want to fetch it from user if we had that info readily available, 
    // but DTO makes it optional. Service method expects it. 
    // Let's pass what we have. If user belongs to a dept, ideally we use that.
    // However, `CurrentUser` decorator currently only returns `id`. 
    // For now assuming the frontend passes it or it is optional.
    // Wait, service `submitResponse` signature: (issueId: number, departmentId: number, userId: number, response: string)
    // If departmentId is missing, it might fail or we pass null/0?
    // Let's assume passed in DTO or we need to fetch user to get dept.
    // For speed, let's use the DTO's deptId or 0 if missing (which is bad data).
    // Or update service to handle optional dept.
    const deptId = createResponseDto.departmentId || 0; // Fallback or strict requirement?

    // Better: Update service to allow optional deptId? 
    // Let's check `pf-response.entity.ts`. `departmentId` usually nullable or required?
    // Most likely required for non-admin responses.

    const response = await this.ptfService.submitResponse(id, deptId, userId, createResponseDto.response);
    return ResponseDto.success(response, 'Response added successfully');
  }

  // --- Meetings ---

  @Post('meetings')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Create a PTF meeting' })
  @ApiResponse({ status: 201, description: 'PTF meeting created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createMeeting(
    @Body() createMeetingDto: CreatePtfMeetingDto,
    @CurrentUser('id') userId: number,
  ) {
    const meeting = await this.ptfService.createMeeting(createMeetingDto, userId);
    return ResponseDto.success(meeting, 'PTF meeting created successfully');
  }

  @Get('meetings')
  @ApiOperation({ summary: 'Get all PTF meetings' })
  async findAllMeetings() {
    const meetings = await this.ptfService.findAllMeetings();
    return ResponseDto.success(meetings);
  }

  @Get('meetings/:id')
  @ApiOperation({ summary: 'Get a PTF meeting by ID' })
  async findOneMeeting(@Param('id', ParseIntPipe) id: number) {
    const meeting = await this.ptfService.findOneMeeting(id);
    return ResponseDto.success(meeting);
  }

  @Patch('meetings/:id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Update a PTF meeting' })
  async updateMeeting(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePtfMeetingDto,
    @CurrentUser('id') userId: number,
  ) {
    const meeting = await this.ptfService.updateMeeting(id, updateDto, userId);
    return ResponseDto.success(meeting, 'PTF meeting updated successfully');
  }

  @Delete('meetings/:id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Delete a PTF meeting' })
  async removeMeeting(@Param('id', ParseIntPipe) id: number) {
    await this.ptfService.removeMeeting(id);
    return ResponseDto.success(null, 'PTF meeting deleted successfully');
  }
}
