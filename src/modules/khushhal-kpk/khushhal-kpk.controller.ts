import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
} from '@nestjs/swagger';
import { KhushhalKpkService } from './khushhal-kpk.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Roles as RolesEnum } from '../../common/enums';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateKhushhalTaskDto } from './dto/create-khushhal-task.dto';
import { UpdateKhushhalTaskDto } from './dto/update-khushhal-task.dto';
import { CreateKhushhalProgressDto } from './dto/create-khushhal-progress.dto';
import { CreateKhushhalReplyDto } from './dto/create-khushhal-reply.dto';

@ApiTags('khushhal-kpk')
@ApiBearerAuth('JWT-auth')
@Controller('khushhal-kpk')
export class KhushhalKpkController {
  constructor(private readonly khushhalKpkService: KhushhalKpkService) { }

  @Post('tasks')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Create a new Khushhal KPK task' })
  async createTask(
    @Body() createTaskDto: CreateKhushhalTaskDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.khushhalKpkService.createTask(createTaskDto, userId);
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Get all Khushhal KPK tasks' })
  async findAll() {
    return this.khushhalKpkService.findAll();
  }

  @Get('tasks/:id')
  @ApiOperation({ summary: 'Get a Khushhal KPK task by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.khushhalKpkService.findOne(id);
  }

  @Patch('tasks/:id')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Update a Khushhal KPK task' })
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateKhushhalTaskDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.khushhalKpkService.updateTask(id, updateDto, userId);
  }

  @Delete('tasks/:id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Archive a Khushhal KPK task' })
  async deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.khushhalKpkService.deleteTask(id);
  }

  @Post('tasks/:id/progress')
  @ApiOperation({ summary: 'Submit progress for a task' })
  async submitProgress(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() progressDto: CreateKhushhalProgressDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.khushhalKpkService.submitProgress(taskId, progressDto, userId);
  }

  // --- Replies ---

  @Get('tasks/:id/replies')
  @ApiOperation({ summary: 'Get replies for a task' })
  async getReplies(@Param('id', ParseIntPipe) taskId: number) {
    return this.khushhalKpkService.getReplies(taskId);
  }

  @Post('tasks/:id/replies')
  @ApiOperation({ summary: 'Add a reply to a task' })
  async addReply(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() replyDto: CreateKhushhalReplyDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.khushhalKpkService.submitReply(taskId, replyDto, userId);
  }

  // --- Department Status ---

  @Patch('tasks/:id/departments/:departmentId/status')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Update status for a department' })
  async updateDepartmentStatus(
    @Param('id', ParseIntPipe) taskId: number,
    @Param('departmentId', ParseIntPipe) departmentId: number,
    @Body('status', ParseIntPipe) status: number,
  ) {
    return this.khushhalKpkService.updateDepartmentStatus(taskId, departmentId, status);
  }
}
