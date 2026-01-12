import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateSectorialMeetingDto } from './dto/create-sectorial-meeting.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { SectorialMeetingsService } from './sectorial-meetings.service';

@ApiTags('sectorial-meetings')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('sectorial-meetings')
export class SectorialMeetingsController {
  constructor(private readonly sectorialMeetingsService: SectorialMeetingsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new sectorial meeting' })
  @ApiResponse({ status: 201, description: 'Sectorial meeting created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createDto: CreateSectorialMeetingDto, @CurrentUser('id') userId: number) {
    return this.sectorialMeetingsService.create(createDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sectorial meetings with pagination' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({ status: 200, description: 'List of sectorial meetings' })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.sectorialMeetingsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific sectorial meeting by ID' })
  @ApiParam({ name: 'id', description: 'Sectorial Meeting ID' })
  @ApiResponse({ status: 200, description: 'Sectorial meeting details' })
  @ApiResponse({ status: 404, description: 'Sectorial meeting not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sectorialMeetingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a sectorial meeting' })
  @ApiParam({ name: 'id', description: 'Sectorial Meeting ID' })
  @ApiResponse({ status: 200, description: 'Sectorial meeting updated successfully' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.sectorialMeetingsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sectorial meeting' })
  @ApiParam({ name: 'id', description: 'Sectorial Meeting ID' })
  @ApiResponse({ status: 200, description: 'Sectorial meeting deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.sectorialMeetingsService.remove(id);
  }
}

