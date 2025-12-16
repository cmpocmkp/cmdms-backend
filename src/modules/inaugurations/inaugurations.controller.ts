import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InaugurationsService } from './inaugurations.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Roles as RolesEnum } from '../../common/enums';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('inaugurations')
@ApiBearerAuth('JWT-auth')
@Controller('inaugurations')
export class InaugurationsController {
  constructor(private readonly inaugurationsService: InaugurationsService) {}

  @Post()
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Create an inauguration' })
  @ApiResponse({ status: 201, description: 'Inauguration created' })
  create(@Body() createDto: any, @CurrentUser('id') userId: number) {
    return this.inaugurationsService.create(createDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inaugurations' })
  @ApiResponse({ status: 200, description: 'Return all inaugurations' })
  findAll() {
    return this.inaugurationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inauguration by ID' })
  @ApiResponse({ status: 200, description: 'Return inauguration' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inaugurationsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Update inauguration' })
  @ApiResponse({ status: 200, description: 'Inauguration updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.inaugurationsService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Delete inauguration' })
  @ApiResponse({ status: 200, description: 'Inauguration deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inaugurationsService.remove(id);
  }
}

