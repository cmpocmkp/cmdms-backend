import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { TrackersService } from './trackers.service';
import { CreateTrackerDto } from './dto/create-tracker.dto';
import { UpdateTrackerDto } from './dto/update-tracker.dto';
import { CreateTrackerActivityDto } from './dto/create-tracker-activity.dto';
import { UpdateTrackerActivityDto } from './dto/update-tracker-activity.dto';
import { CreateTrackerReplyDto } from './dto/create-tracker-reply.dto';
import { AssignTrackerDto } from './dto/assign-tracker.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('trackers')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('trackers')
export class TrackersController {
    constructor(private readonly trackersService: TrackersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new tracker' })
    @ApiResponse({ status: 201, description: 'Tracker created successfully' })
    create(@Body() createTrackerDto: CreateTrackerDto) {
        return this.trackersService.create(createTrackerDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all trackers' })
    @ApiResponse({ status: 200, description: 'List of trackers with pagination metadata' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'type', required: false })
    @ApiQuery({ name: 'departmentId', required: false })
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'fromDate', required: false })
    @ApiQuery({ name: 'toDate', required: false })
    @ApiQuery({ name: 'sortBy', required: false })
    @ApiQuery({ name: 'sortOrder', required: false })
    findAll(@Query() query: any) {
        return this.trackersService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get tracker details' })
    @ApiResponse({ status: 200, description: 'Tracker details including activities and replies' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.trackersService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a tracker' })
    @ApiResponse({ status: 200, description: 'Tracker updated successfully' })
    update(@Param('id', ParseIntPipe) id: number, @Body() updateTrackerDto: UpdateTrackerDto) {
        return this.trackersService.update(id, updateTrackerDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a tracker' })
    @ApiResponse({ status: 200, description: 'Tracker deleted successfully' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.trackersService.remove(id);
    }

    @Post(':id/assign')
    @ApiOperation({ summary: 'Assign tracker to departments' })
    @ApiResponse({ status: 200, description: 'Tracker assigned to departments successfully' })
    assignDepartments(@Param('id', ParseIntPipe) id: number, @Body() assignDto: AssignTrackerDto) {
        return this.trackersService.assignDepartments(id, assignDto);
    }

    // --- Activities ---

    @Get(':id/activities')
    @ApiOperation({ summary: 'List tracker activities' })
    findActivities(@Param('id', ParseIntPipe) id: number) {
        return this.trackersService.findActivities(id);
    }

    @Post(':id/activities')
    @ApiOperation({ summary: 'Create tracker activity' })
    createActivity(@Param('id', ParseIntPipe) id: number, @Body() createActivityDto: CreateTrackerActivityDto) {
        return this.trackersService.createActivity(id, createActivityDto);
    }

    @Patch(':id/activities/:activityId')
    @ApiOperation({ summary: 'Update tracker activity' })
    updateActivity(
        @Param('id', ParseIntPipe) trackerId: number,
        @Param('activityId', ParseIntPipe) activityId: number,
        @Body() updateActivityDto: UpdateTrackerActivityDto
    ) {
        return this.trackersService.updateActivity(activityId, updateActivityDto);
    }

    @Delete(':id/activities/:activityId')
    @ApiOperation({ summary: 'Delete tracker activity' })
    removeActivity(
        @Param('id', ParseIntPipe) trackerId: number,
        @Param('activityId', ParseIntPipe) activityId: number
    ) {
        return this.trackersService.removeActivity(activityId);
    }

    // --- Replies ---

    @Get(':id/replies')
    @ApiOperation({ summary: 'Get tracker replies' })
    findReplies(@Param('id', ParseIntPipe) id: number) {
        return this.trackersService.findReplies(id);
    }

    @Post(':id/replies')
    @ApiOperation({ summary: 'Create tracker reply' })
    @ApiResponse({ status: 201, description: 'Reply created successfully' })
    createReply(
        @Param('id', ParseIntPipe) id: number,
        @Body() createReplyDto: CreateTrackerReplyDto,
        @Request() req: any
    ) {
        const userId = req.user.id;
        return this.trackersService.createReply(id, userId, createReplyDto);
    }

    @Get(':id/activities/:activityId/replies')
    @ApiOperation({ summary: 'Get activity replies' })
    findActivityReplies(
        @Param('id', ParseIntPipe) trackerId: number,
        @Param('activityId', ParseIntPipe) activityId: number
    ) {
        return this.trackersService.findActivityReplies(activityId);
    }

    @Post(':id/activities/:activityId/replies')
    @ApiOperation({ summary: 'Create activity reply' })
    @ApiResponse({ status: 201, description: 'Activity reply created successfully' })
    createActivityReply(
        @Param('id', ParseIntPipe) trackerId: number,
        @Param('activityId', ParseIntPipe) activityId: number,
        @Body() createReplyDto: CreateTrackerReplyDto,
        @Request() req: any
    ) {
        const userId = req.user.id;
        return this.trackersService.createActivityReply(activityId, userId, createReplyDto);
    }
}
