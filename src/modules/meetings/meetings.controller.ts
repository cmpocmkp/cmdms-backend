import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('meetings')
@ApiBearerAuth('JWT-auth')
@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new meeting' })
  @ApiResponse({ status: 201, description: 'Meeting created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createMeetingDto: CreateMeetingDto,
    @CurrentUser('id') userId: number,
  ) {
    const meeting = await this.meetingsService.create(createMeetingDto, userId);
    return ResponseDto.success(meeting, 'Meeting created successfully');
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.meetingsService.findAll(paginationDto);
    return ResponseDto.success(result.data, undefined, result.metadata);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const meeting = await this.meetingsService.findOne(id);
    return ResponseDto.success(meeting);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMeetingDto: UpdateMeetingDto,
    @CurrentUser('id') userId: number,
  ) {
    const meeting = await this.meetingsService.update(id, updateMeetingDto, userId);
    return ResponseDto.success(meeting, 'Meeting updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.meetingsService.remove(id);
    return ResponseDto.success(null, 'Meeting deleted successfully');
  }
}

