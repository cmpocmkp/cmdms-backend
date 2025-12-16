import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('files')
@ApiBearerAuth('JWT-auth')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a file' })
  @ApiResponse({ status: 201, description: 'File uploaded' })
  create(@Body() createDto: any, @CurrentUser('id') userId: number) {
    return this.filesService.create(createDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all files' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'id', required: false })
  @ApiResponse({ status: 200, description: 'Return files' })
  findAll(@Query('type') type?: string, @Query('id') id?: number) {
    if (type && id) return this.filesService.findByAttachable(type, id);
    return this.filesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file by ID' })
  @ApiResponse({ status: 200, description: 'Return file' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file' })
  @ApiResponse({ status: 200, description: 'File deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.filesService.remove(id);
  }
}

