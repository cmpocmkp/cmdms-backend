import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateSenateMeetingDto } from './dto/create-senate-meeting.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { SenateMeetingsService } from './senate-meetings.service';

@ApiTags('senate-meetings')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('senate-meetings')
export class SenateMeetingsController {
  constructor(private readonly senateMeetingsService: SenateMeetingsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new senate meeting', description: 'Creates a new university senate meeting record' })
  @ApiResponse({ status: 201, description: 'Senate meeting created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createDto: CreateSenateMeetingDto, @CurrentUser('id') userId: number) {
    return this.senateMeetingsService.create(createDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all senate meetings with pagination' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({ status: 200, description: 'List of senate meetings' })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.senateMeetingsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific senate meeting by ID' })
  @ApiParam({ name: 'id', description: 'Senate Meeting ID', type: Number })
  @ApiResponse({ status: 200, description: 'Senate meeting details with minutes' })
  @ApiResponse({ status: 404, description: 'Senate meeting not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.senateMeetingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a senate meeting' })
  @ApiParam({ name: 'id', description: 'Senate Meeting ID' })
  @ApiResponse({ status: 200, description: 'Senate meeting updated successfully' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.senateMeetingsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a senate meeting' })
  @ApiParam({ name: 'id', description: 'Senate Meeting ID' })
  @ApiResponse({ status: 200, description: 'Senate meeting deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.senateMeetingsService.remove(id);
  }
}

