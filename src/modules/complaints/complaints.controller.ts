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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('complaints')
@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Submit a public complaint' })
  @ApiResponse({ status: 201, description: 'Complaint registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createComplaintDto: CreateComplaintDto) {
    const complaint = await this.complaintsService.create(createComplaintDto, 0);
    return ResponseDto.success(complaint, 'Complaint registered successfully');
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  @ApiOperation({ summary: 'Get all complaints' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({ status: 200, description: 'Return all complaints' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.complaintsService.findAll(paginationDto);
    return ResponseDto.success(result.data, undefined, result.metadata);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  @ApiOperation({ summary: 'Get complaint by ID' })
  @ApiResponse({ status: 200, description: 'Return complaint details' })
  @ApiResponse({ status: 404, description: 'Complaint not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const complaint = await this.complaintsService.findOne(id);
    return ResponseDto.success(complaint);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update complaint status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 404, description: 'Complaint not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
    @CurrentUser('id') userId: number,
  ) {
    const complaint = await this.complaintsService.updateStatus(id, status, userId);
    return ResponseDto.success(complaint, 'Status updated successfully');
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post(':id/responses')
  @ApiOperation({ summary: 'Submit response to complaint' })
  @ApiResponse({ status: 201, description: 'Response submitted successfully' })
  @ApiResponse({ status: 404, description: 'Complaint not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async submitResponse(
    @Param('id', ParseIntPipe) id: number,
    @Body() responseData: any,
    @CurrentUser('id') userId: number,
    @CurrentUser('departmentId') departmentId: number,
  ) {
    const response = await this.complaintsService.submitResponse(id, departmentId, userId, responseData);
    return ResponseDto.success(response, 'Response submitted successfully');
  }

  @Public()
  @Post(':id/feedback')
  async submitFeedback(
    @Param('id', ParseIntPipe) id: number,
    @Body('rating') rating: number,
    @Body('feedback') feedback: string,
  ) {
    const complaint = await this.complaintsService.submitFeedback(id, rating, feedback);
    return ResponseDto.success(complaint, 'Feedback submitted successfully');
  }
}

