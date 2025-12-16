import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { KpiService } from './kpi.service';
import { CreateKpiDto, SubmitKpiDataDto } from './dto/create-kpi.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Roles as RolesEnum } from '../../common/enums';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('kpi')
@ApiBearerAuth('JWT-auth')
@Controller('kpi')
export class KpiController {
  constructor(private readonly kpiService: KpiService) {}

  @Post()
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Create a new KPI' })
  @ApiResponse({ status: 201, description: 'KPI created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @Body() createKpiDto: CreateKpiDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.kpiService.create(createKpiDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all KPIs' })
  @ApiQuery({
    name: 'departmentId',
    required: false,
    description: 'Filter by department',
  })
  @ApiResponse({ status: 200, description: 'Return all KPIs' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query('departmentId') departmentId?: number) {
    return this.kpiService.findAll(departmentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a KPI by ID' })
  @ApiResponse({ status: 200, description: 'Return the KPI' })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.kpiService.findOne(id);
  }

  @Post(':id/data')
  @ApiOperation({ summary: 'Submit KPI data' })
  @ApiResponse({ status: 201, description: 'KPI data submitted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  submitData(
    @Param('id', ParseIntPipe) kpiId: number,
    @Body() submitKpiDataDto: SubmitKpiDataDto,
    @CurrentUser('id') userId: number,
    @CurrentUser('departmentId') departmentId: number,
  ) {
    return this.kpiService.submitData(
      kpiId,
      departmentId,
      userId,
      submitKpiDataDto,
    );
  }

  @Get(':id/data')
  @ApiOperation({ summary: 'Get KPI data history' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter start date',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter end date',
  })
  @ApiResponse({ status: 200, description: 'Return KPI data' })
  @ApiResponse({ status: 404, description: 'KPI not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getData(
    @Param('id', ParseIntPipe) kpiId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.kpiService.getDataByKpi(kpiId, start, end);
  }

//   @Get('department/:departmentId/summary')
//   @ApiOperation({ summary: 'Get KPI summary for a department' })
//   @ApiResponse({ status: 200, description: 'Return KPI summary' })
//   @ApiResponse({ status: 401, description: 'Unauthorized' })
//   getDepartmentSummary(@Param('departmentId', ParseIntPipe) departmentId: number) {
//     return this.kpiService.getDepartmentSummary(departmentId);
//   }
}

