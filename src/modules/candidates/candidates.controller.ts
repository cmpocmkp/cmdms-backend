import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Candidates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('candidates')
export class CandidatesController {
  @Post()
  @ApiOperation({ 
    summary: 'Add a new candidate (MNA/MPA)', 
    description: 'Registers a new Member of National/Provincial Assembly with constituency details'
  })
  @ApiResponse({ status: 201, description: 'Candidate added successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createDto: CreateCandidateDto, @CurrentUser('id') userId: number) {
    return { message: 'Candidate added', data: createDto };
  }

  @Get()
  @ApiOperation({ summary: 'Get all candidates with filters' })
  @ApiQuery({ type: PaginationDto })
  @ApiQuery({ name: 'type', required: false, enum: ['MNA', 'MPA'], description: 'Filter by candidate type' })
  @ApiQuery({ name: 'party', required: false, type: String, description: 'Filter by political party' })
  @ApiResponse({ status: 200, description: 'List of candidates' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('type') type?: string,
    @Query('party') party?: string
  ) {
    return { data: [], metadata: { page: 1, limit: 10, total: 0 } };
  }

  @Get('constituencies')
  @ApiOperation({ summary: 'Get all constituencies' })
  @ApiResponse({ status: 200, description: 'List of all constituencies (National & Provincial)' })
  async getConstituencies() {
    return { data: [] };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific candidate by ID' })
  @ApiParam({ name: 'id', description: 'Candidate ID', type: Number })
  @ApiResponse({ status: 200, description: 'Candidate details with constituency information' })
  @ApiResponse({ status: 404, description: 'Candidate not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return { data: { id } };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update candidate information' })
  @ApiParam({ name: 'id', description: 'Candidate ID' })
  @ApiResponse({ status: 200, description: 'Candidate updated successfully' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return { message: 'Candidate updated', data: { id, ...updateDto } };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a candidate' })
  @ApiParam({ name: 'id', description: 'Candidate ID' })
  @ApiResponse({ status: 200, description: 'Candidate deleted successfully' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return { message: 'Candidate deleted' };
  }
}

