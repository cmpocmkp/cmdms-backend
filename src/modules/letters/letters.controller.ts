import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateLetterDto } from './dto/create-letter.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Letters & Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('letters')
export class LettersController {
  @Post()
  @ApiOperation({ 
    summary: 'Create a new letter/document', 
    description: 'Generates a new official letter, notice, circular, or memo with optional references'
  })
  @ApiResponse({ status: 201, description: 'Letter created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createDto: CreateLetterDto, @CurrentUser('id') userId: number) {
    return { message: 'Letter created', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all letters with pagination and filters' })
  @ApiQuery({ type: PaginationDto })
  @ApiQuery({ name: 'type', required: false, enum: ['official', 'notice', 'circular', 'memo'], description: 'Filter by letter type' })
  @ApiQuery({ name: 'status', required: false, enum: ['draft', 'sent', 'received', 'archived'], description: 'Filter by status' })
  @ApiQuery({ name: 'fromDepartmentId', required: false, type: Number, description: 'Filter by sender department' })
  @ApiQuery({ name: 'toDepartmentId', required: false, type: Number, description: 'Filter by recipient department' })
  @ApiResponse({ status: 200, description: 'List of letters' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('fromDepartmentId') fromDepartmentId?: number,
    @Query('toDepartmentId') toDepartmentId?: number
  ) {
    return { data: [], metadata: { page: 1, limit: 10, total: 0 } };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific letter by ID' })
  @ApiParam({ name: 'id', description: 'Letter ID', type: Number })
  @ApiResponse({ status: 200, description: 'Letter details with full content and attachments' })
  @ApiResponse({ status: 404, description: 'Letter not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return { data: { id } };
  }

  @Get(':id/generate-pdf')
  @ApiOperation({ summary: 'Generate PDF version of the letter' })
  @ApiParam({ name: 'id', description: 'Letter ID' })
  @ApiResponse({ status: 200, description: 'PDF generated successfully', content: { 'application/pdf': {} } })
  @ApiResponse({ status: 404, description: 'Letter not found' })
  async generatePdf(@Param('id', ParseIntPipe) id: number) {
    return { message: 'PDF generation feature - to be implemented', data: { letterId: id } };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a letter' })
  @ApiParam({ name: 'id', description: 'Letter ID' })
  @ApiResponse({ status: 200, description: 'Letter updated successfully' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return { message: 'Letter updated', data: { id, ...updateDto } };
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Mark letter as sent' })
  @ApiParam({ name: 'id', description: 'Letter ID' })
  @ApiResponse({ status: 200, description: 'Letter marked as sent' })
  async send(@Param('id', ParseIntPipe) id: number) {
    return { message: 'Letter sent' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a letter' })
  @ApiParam({ name: 'id', description: 'Letter ID' })
  @ApiResponse({ status: 200, description: 'Letter deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return { message: 'Letter deleted' };
  }
}

