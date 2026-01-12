import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateCmRemarkDto } from './dto/create-cm-remark.dto';
import { UpdateCmRemarkDto } from './dto/update-cm-remark.dto';
import { CreateCMRemarkResponseDto } from './dto/create-cm-remark-response.dto';
import { UpdateCMRemarkDepartmentDto } from './dto/update-cm-remark-department.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CMRemarksService } from './cm-remarks.service';
import { ResponseDto } from '../../common/dto/response.dto';

@ApiTags('cm-remarks')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('cm-remarks')
@UseGuards(JwtAuthGuard)
export class CmRemarksController {
  constructor(private readonly cmRemarksService: CMRemarksService) { }

  @Post()
  async create(
    @Body() createDto: CreateCmRemarkDto,
    @CurrentUser('id') userId: number,
  ) {
    const remark = await this.cmRemarksService.create(createDto, userId);
    return ResponseDto.success(remark, 'CM Remark created successfully');
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.cmRemarksService.findAll(paginationDto);
    return ResponseDto.success(result.data, undefined, result.metadata);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const remark = await this.cmRemarksService.findOne(id);
    return ResponseDto.success(remark);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCmRemarkDto,
  ) {
    const remark = await this.cmRemarksService.update(id, updateDto);
    return ResponseDto.success(remark, 'CM Remark updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.cmRemarksService.remove(id);
    return ResponseDto.success(null, 'CM Remark deleted successfully');
  }

  @Get(':id/responses')
  async getResponses(@Param('id', ParseIntPipe) id: number) {
    const responses = await this.cmRemarksService.findResponses(id);
    return ResponseDto.success(responses);
  }

  @Post(':id/responses')
  async createResponse(
    @Param('id', ParseIntPipe) id: number,
    @Body() createDto: CreateCMRemarkResponseDto,
    @CurrentUser('id') userId: number,
  ) {
    const response = await this.cmRemarksService.createResponse(id, createDto, userId);
    return ResponseDto.success(response, 'Response added successfully');
  }

  @Get(':id/responses/:responseId')
  async getResponse(@Param('responseId', ParseIntPipe) responseId: number) {
    const response = await this.cmRemarksService.findResponse(responseId);
    return ResponseDto.success(response);
  }

  @Get(':id/departments')
  async getDepartments(@Param('id', ParseIntPipe) id: number) {
    const departments = await this.cmRemarksService.getDepartments(id);
    return ResponseDto.success(departments);
  }

  @Patch(':id/departments/:departmentId/status')
  async updateDepartmentStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('departmentId', ParseIntPipe) departmentId: number,
    @Body() updateDto: UpdateCMRemarkDepartmentDto,
  ) {
    const result = await this.cmRemarksService.updateDepartmentStatus(id, departmentId, updateDto);
    return ResponseDto.success(result, 'Department status updated successfully');
  }
}

