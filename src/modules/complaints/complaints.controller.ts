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
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('complaints')
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Public()
  @Post()
  async create(@Body() createComplaintDto: CreateComplaintDto) {
    const complaint = await this.complaintsService.create(createComplaintDto, 0);
    return ResponseDto.success(complaint, 'Complaint registered successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.complaintsService.findAll(paginationDto);
    return ResponseDto.success(result.data, undefined, result.metadata);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const complaint = await this.complaintsService.findOne(id);
    return ResponseDto.success(complaint);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
    @CurrentUser('id') userId: number,
  ) {
    const complaint = await this.complaintsService.updateStatus(id, status, userId);
    return ResponseDto.success(complaint, 'Status updated successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/responses')
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

