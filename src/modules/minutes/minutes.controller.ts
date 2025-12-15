import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { MinutesService } from './minutes.service';
import { CreateMinuteDto } from './dto/create-minute.dto';
import { UpdateMinuteDto } from './dto/update-minute.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('minutes')
@ApiBearerAuth('JWT-auth')
@Controller('minutes')
@UseGuards(JwtAuthGuard)
export class MinutesController {
  constructor(private readonly minutesService: MinutesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new minute/decision' })
  @ApiResponse({ status: 201, description: 'Minute created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createMinuteDto: CreateMinuteDto,
    @CurrentUser('id') userId: number,
  ) {
    const minute = await this.minutesService.create(createMinuteDto, userId);
    return ResponseDto.success(minute, 'Minute created successfully');
  }

  @Get('meeting/:meetingId')
  async findByMeeting(@Param('meetingId', ParseIntPipe) meetingId: number) {
    const minutes = await this.minutesService.findByMeeting(meetingId);
    return ResponseDto.success(minutes);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const minute = await this.minutesService.findOne(id);
    return ResponseDto.success(minute);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMinuteDto: UpdateMinuteDto,
    @CurrentUser('id') userId: number,
  ) {
    const minute = await this.minutesService.update(id, updateMinuteDto, userId);
    return ResponseDto.success(minute, 'Minute updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.minutesService.remove(id);
    return ResponseDto.success(null, 'Minute deleted successfully');
  }

  @Post(':id/archive')
  async archive(@Param('id', ParseIntPipe) id: number) {
    const minute = await this.minutesService.archive(id);
    return ResponseDto.success(minute, 'Minute archived successfully');
  }

  @Get(':id/replies')
  async findReplies(@Param('id', ParseIntPipe) id: number) {
    const replies = await this.minutesService.findReplies(id);
    return ResponseDto.success(replies);
  }

  @Post(':id/replies')
  async createReply(
    @Param('id', ParseIntPipe) minuteId: number,
    @Body() createReplyDto: CreateReplyDto,
    @CurrentUser('id') userId: number,
    @CurrentUser('departmentId') departmentId: number,
  ) {
    const reply = await this.minutesService.createReply(
      { ...createReplyDto, minuteId },
      userId,
      departmentId,
    );
    return ResponseDto.success(reply, 'Reply submitted successfully');
  }
}

