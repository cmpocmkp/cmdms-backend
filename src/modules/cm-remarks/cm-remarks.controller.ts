import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateCmRemarkDto } from './dto/create-cm-remark.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('CM Remarks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cm-remarks')
export class CmRemarksController {
  @Post()
  @ApiOperation({ 
    summary: 'Create a new CM remark', 
    description: 'Records a new remark or intervention from the Chief Minister with department assignments'
  })
  @ApiResponse({ status: 201, description: 'CM remark created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - insufficient permissions' })
  async create(@Body() createDto: CreateCmRemarkDto, @CurrentUser('id') userId: number) {
    return { message: 'CM remark created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all CM remarks with pagination and filters' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({ status: 200, description: 'List of CM remarks' })
  async findAll(@Query() paginationDto: PaginationDto) {
    return { data: [], metadata: { page: 1, limit: 10, total: 0 } };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific CM remark by ID' })
  @ApiParam({ name: 'id', description: 'CM Remark ID', type: Number })
  @ApiResponse({ status: 200, description: 'CM remark details with department assignments' })
  @ApiResponse({ status: 404, description: 'CM remark not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return { data: { id } };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a CM remark' })
  @ApiParam({ name: 'id', description: 'CM Remark ID' })
  @ApiResponse({ status: 200, description: 'CM remark updated successfully' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return { message: 'CM remark updated', data: { id, ...updateDto } };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a CM remark' })
  @ApiParam({ name: 'id', description: 'CM Remark ID' })
  @ApiResponse({ status: 200, description: 'CM remark deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return { message: 'CM remark deleted' };
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archive a CM remark' })
  @ApiParam({ name: 'id', description: 'CM Remark ID' })
  @ApiResponse({ status: 200, description: 'CM remark archived successfully' })
  async archive(@Param('id', ParseIntPipe) id: number) {
    return { message: 'CM remark archived' };
  }
}

