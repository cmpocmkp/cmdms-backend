import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreatePublicDayDto } from './dto/create-public-day.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Public Days')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('public-days')
export class PublicDaysController {
  @Post()
  @ApiOperation({ 
    summary: 'Record a new public day event', 
    description: 'Creates a record of CM public day with applications received and resolved'
  })
  @ApiResponse({ status: 201, description: 'Public day record created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createDto: CreatePublicDayDto, @CurrentUser('id') userId: number) {
    return { message: 'Public day recorded', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all public day records with pagination' })
  @ApiQuery({ type: PaginationDto })
  @ApiQuery({ name: 'districtId', required: false, type: Number, description: 'Filter by district' })
  @ApiResponse({ status: 200, description: 'List of public day records' })
  async findAll(@Query() paginationDto: PaginationDto, @Query('districtId') districtId?: number) {
    return { data: [], metadata: { page: 1, limit: 10, total: 0 } };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get public days statistics' })
  @ApiResponse({ status: 200, description: 'Public days statistics and summary' })
  async getStats() {
    return { 
      data: { 
        totalEvents: 0, 
        totalApplications: 0, 
        totalResolved: 0, 
        resolutionRate: 0 
      } 
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific public day record by ID' })
  @ApiParam({ name: 'id', description: 'Public Day ID', type: Number })
  @ApiResponse({ status: 200, description: 'Public day details' })
  @ApiResponse({ status: 404, description: 'Public day record not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return { data: { id } };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a public day record' })
  @ApiParam({ name: 'id', description: 'Public Day ID' })
  @ApiResponse({ status: 200, description: 'Public day record updated successfully' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return { message: 'Public day updated', data: { id, ...updateDto } };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a public day record' })
  @ApiParam({ name: 'id', description: 'Public Day ID' })
  @ApiResponse({ status: 200, description: 'Public day record deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return { message: 'Public day deleted' };
  }
}

