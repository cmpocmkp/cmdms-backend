import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { SummariesService } from './summaries.service';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { UpdateSummaryDto } from './dto/update-summary.dto';
import { CreateSummaryTaskDto } from './dto/create-summary-task.dto';
import { UpdateSummaryTaskDto } from './dto/update-summary-task.dto';
import { CreateSummaryReplyDto } from './dto/create-summary-reply.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('summaries')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('summaries')
export class SummariesController {
    constructor(private readonly summariesService: SummariesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new summary' })
    create(@Body() createSummaryDto: CreateSummaryDto) {
        return this.summariesService.create(createSummaryDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all summaries' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'departmentId', required: false })
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'fromDate', required: false })
    @ApiQuery({ name: 'toDate', required: false })
    @ApiQuery({ name: 'sortBy', required: false })
    @ApiQuery({ name: 'sortOrder', required: false })
    findAll(@Query() query: any) {
        return this.summariesService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get summary details' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.summariesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a summary' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateSummaryDto: UpdateSummaryDto) {
        return this.summariesService.update(id, updateSummaryDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a summary' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.summariesService.remove(id);
    }

    // --- Tasks ---

    @Get(':id/tasks')
    @ApiOperation({ summary: 'List summary tasks' })
    findTasks(@Param('id', ParseIntPipe) id: number) {
        return this.summariesService.findTasks(id);
    }

    @Post(':id/tasks')
    @ApiOperation({ summary: 'Create summary task' })
    createTask(@Param('id', ParseIntPipe) id: number, @Body() createTaskDto: CreateSummaryTaskDto) {
        return this.summariesService.createTask(id, createTaskDto);
    }

    @Patch(':id/tasks/:taskId')
    @ApiOperation({ summary: 'Update summary task' })
    updateTask(
        @Param('id', ParseIntPipe) summaryId: number,
        @Param('taskId', ParseIntPipe) taskId: number,
        @Body() updateTaskDto: UpdateSummaryTaskDto
    ) {
        return this.summariesService.updateTask(taskId, updateTaskDto);
    }

    @Delete(':id/tasks/:taskId')
    @ApiOperation({ summary: 'Delete summary task' })
    removeTask(
        @Param('id', ParseIntPipe) summaryId: number,
        @Param('taskId', ParseIntPipe) taskId: number
    ) {
        return this.summariesService.removeTask(taskId);
    }

    // --- Replies ---

    @Get(':id/replies')
    @ApiOperation({ summary: 'Get summary replies' })
    findReplies(@Param('id', ParseIntPipe) id: number) {
        return this.summariesService.findReplies(id);
    }

    @Post(':id/replies')
    @ApiOperation({ summary: 'Create summary reply' })
    createReply(
        @Param('id', ParseIntPipe) id: number,
        @Body() createReplyDto: CreateSummaryReplyDto,
        @Request() req
    ) {
        const userId = req.user.id;
        return this.summariesService.createReply(id, userId, createReplyDto);
    }
}
