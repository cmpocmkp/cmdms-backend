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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('tasks')
@ApiBearerAuth('JWT-auth')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser('id') userId: number,
  ) {
    const task = await this.tasksService.create(createTaskDto, userId);
    return ResponseDto.success(task, 'Task created successfully');
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @CurrentUser('id') userId?: number,
    @CurrentUser('departmentId') departmentId?: number,
  ) {
    const result = await this.tasksService.findAll(paginationDto, userId, departmentId);
    return ResponseDto.success(result.data, undefined, result.metadata);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const task = await this.tasksService.findOne(id);
    return ResponseDto.success(task);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
    @CurrentUser('id') userId: number,
  ) {
    const task = await this.tasksService.updateStatus(id, status, userId);
    return ResponseDto.success(task, 'Task status updated successfully');
  }

  @Post(':id/comments')
  async addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body('comment') comment: string,
    @CurrentUser('id') userId: number,
  ) {
    const taskComment = await this.tasksService.addComment(id, userId, comment);
    return ResponseDto.success(taskComment, 'Comment added successfully');
  }
}

