import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IssueStatus } from '../../common/enums';

@ApiTags('issues')
@ApiBearerAuth('JWT-auth')
@Controller('issues')
@UseGuards(JwtAuthGuard)
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  async create(
    @Body() createIssueDto: CreateIssueDto,
    @CurrentUser('id') userId: number,
  ) {
    const issue = await this.issuesService.create(createIssueDto, userId);
    return ResponseDto.success(issue, 'Issue created successfully');
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.issuesService.findAll(paginationDto);
    return ResponseDto.success(result.data, undefined, result.metadata);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const issue = await this.issuesService.findOne(id);
    return ResponseDto.success(issue);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: IssueStatus,
    @Body('remarks') remarks: string,
    @CurrentUser('id') userId: number,
  ) {
    const issue = await this.issuesService.updateStatus(id, status, userId, remarks);
    return ResponseDto.success(issue, 'Issue status updated successfully');
  }

  @Post(':id/assign')
  async assignDepartment(
    @Param('id', ParseIntPipe) id: number,
    @Body('departmentId') departmentId: number,
    @Body('remarks') remarks: string,
    @CurrentUser('id') userId: number,
  ) {
    const issue = await this.issuesService.assignDepartment(id, departmentId, userId, remarks);
    return ResponseDto.success(issue, 'Issue assigned successfully');
  }
}

