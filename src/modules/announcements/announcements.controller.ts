import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('announcements')
@ApiBearerAuth('JWT-auth')
@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  async create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @CurrentUser('id') userId: number,
  ) {
    const announcement = await this.announcementsService.create(createAnnouncementDto, userId);
    return ResponseDto.success(announcement, 'Announcement created successfully');
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.announcementsService.findAll(paginationDto);
    return ResponseDto.success(result.data, undefined, result.metadata);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const announcement = await this.announcementsService.findOne(id);
    return ResponseDto.success(announcement);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    @CurrentUser('id') userId: number,
  ) {
    const announcement = await this.announcementsService.update(id, updateAnnouncementDto, userId);
    return ResponseDto.success(announcement, 'Announcement updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.announcementsService.remove(id);
    return ResponseDto.success(null, 'Announcement deleted successfully');
  }

  @Post('details/:detailId/responses')
  async submitResponse(
    @Param('detailId', ParseIntPipe) detailId: number,
    @Body('response') response: string,
    @CurrentUser('id') userId: number,
    @CurrentUser('departmentId') departmentId: number,
  ) {
    const announcementResponse = await this.announcementsService.submitResponse(detailId, departmentId, userId, response);
    return ResponseDto.success(announcementResponse, 'Response submitted successfully');
  }
}

