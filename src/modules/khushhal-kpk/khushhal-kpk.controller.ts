import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
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

@ApiTags('khushhal-kpk')
@ApiBearerAuth('JWT-auth')
@Controller('khushhal-kpk')
export class KhushhalKpkController {
  constructor(private readonly khushhalKpkService: KhushhalKpkService) {}

  @Post('tasks')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Create a new Khushhal KPK task' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createTask(
    @Body() createTaskDto: any,
    @CurrentUser('id') userId: number,
  ) {
    return this.khushhalKpkService.createTask(createTaskDto, userId);
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Get all Khushhal KPK tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.khushhalKpkService.findAll();
  }

  @Get('tasks/:id')
  @ApiOperation({ summary: 'Get a Khushhal KPK task by ID' })
  @ApiResponse({ status: 200, description: 'Return the task' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.khushhalKpkService.findOne(id);
  }

  @Post('tasks/:id/progress')
  @ApiOperation({ summary: 'Submit progress for a task' })
  @ApiResponse({ status: 201, description: 'Progress submitted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  submitProgress(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() progressDto: any,
    @CurrentUser('id') userId: number,
  ) {
    return this.khushhalKpkService.submitProgress(taskId, progressDto, userId);
  }

  // Advanced features - to be implemented
  // @Post('tasks/:id/reply')
  // @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  // @ApiOperation({ summary: 'Reply to a task' })
  // addReply(@Param('id', ParseIntPipe) taskId: number, @Body() replyDto: any, @CurrentUser('id') userId: number) {
  //   return this.khushhalKpkService.addReply(taskId, replyDto, userId);
  // }

  // @Get('department/:departmentId/status')
  // @ApiOperation({ summary: 'Get department task status' })
  // getDepartmentStatus(@Param('departmentId', ParseIntPipe) departmentId: number) {
  //   return this.khushhalKpkService.getDepartmentStatus(departmentId);
  // }
}
