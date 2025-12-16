import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateSectorialMeetingDto } from './dto/create-sectorial-meeting.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('sectorial-meetings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sectorial-meetings')
export class SectorialMeetingsController {
  @Post()
  @ApiOperation({ summary: 'Create a new sectorial meeting' })
  @ApiResponse({ status: 201, description: 'Sectorial meeting created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createDto: CreateSectorialMeetingDto, @CurrentUser('id') userId: number) {
    return { message: 'Sectorial meeting created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all sectorial meetings with pagination' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({ status: 200, description: 'List of sectorial meetings' })
  async findAll(@Query() paginationDto: PaginationDto) {
    return { data: [], metadata: { page: 1, limit: 10, total: 0 } };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific sectorial meeting by ID' })
  @ApiParam({ name: 'id', description: 'Sectorial Meeting ID' })
  @ApiResponse({ status: 200, description: 'Sectorial meeting details' })
  @ApiResponse({ status: 404, description: 'Sectorial meeting not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return { data: { id } };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a sectorial meeting' })
  @ApiParam({ name: 'id', description: 'Sectorial Meeting ID' })
  @ApiResponse({ status: 200, description: 'Sectorial meeting updated successfully' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return { message: 'Sectorial meeting updated', data: { id, ...updateDto } };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sectorial meeting' })
  @ApiParam({ name: 'id', description: 'Sectorial Meeting ID' })
  @ApiResponse({ status: 200, description: 'Sectorial meeting deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return { message: 'Sectorial meeting deleted' };
  }
}

