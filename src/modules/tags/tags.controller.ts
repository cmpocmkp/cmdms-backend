import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TagsService } from './tags.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Roles as RolesEnum } from '../../common/enums';

@ApiTags('tags')
@ApiBearerAuth('JWT-auth')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Create a tag' })
  @ApiResponse({ status: 201, description: 'Tag created' })
  create(@Body() createDto: any) {
    return this.tagsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, description: 'Return all tags' })
  findAll() {
    return this.tagsService.findAll();
  }

  // Note: Use findAll() and filter by ID or use getTagsForEntity()
  // @Get(':id')
  // @ApiOperation({ summary: 'Get tag by ID' })
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.tagsService.findOne(id);
  // }

  @Post('attach')
  @ApiOperation({ summary: 'Attach tag to entity' })
  @ApiResponse({ status: 201, description: 'Tag attached' })
  attachTag(@Body() attachDto: any) {
    return this.tagsService.attachTag(attachDto.tagId, attachDto.taggableType, attachDto.taggableId);
  }

  @Delete('detach')
  @ApiOperation({ summary: 'Detach tag from entity' })
  @ApiResponse({ status: 200, description: 'Tag detached' })
  removeTag(@Body() detachDto: any) {
    return this.tagsService.removeTag(detachDto.tagId, detachDto.taggableType, detachDto.taggableId);
  }

  @Get('entity/:type/:id')
  @ApiOperation({ summary: 'Get tags for an entity' })
  @ApiResponse({ status: 200, description: 'Return entity tags' })
  getEntityTags(@Param('type') type: string, @Param('id', ParseIntPipe) id: number) {
    return this.tagsService.getTagsForEntity(type, id);
  }

  // Note: Use removeTag() to detach tags from entities
  // @Delete(':id')
  // @Roles(RolesEnum.ADMIN)
  // @ApiOperation({ summary: 'Delete tag' })
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.tagsService.remove(id);
  // }
}

