import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WelfareService } from './welfare.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Roles as RolesEnum } from '../../common/enums';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('welfare')
@ApiBearerAuth('JWT-auth')
@Controller('welfare')
export class WelfareController {
  constructor(private readonly welfareService: WelfareService) {}

  @Post()
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Create a welfare initiative' })
  @ApiResponse({ status: 201, description: 'Initiative created' })
  create(@Body() createDto: any, @CurrentUser('id') userId: number) {
    return this.welfareService.create(createDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all welfare initiatives' })
  @ApiResponse({ status: 200, description: 'Return all initiatives' })
  findAll() {
    return this.welfareService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get initiative by ID' })
  @ApiResponse({ status: 200, description: 'Return initiative' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.welfareService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Update initiative' })
  @ApiResponse({ status: 200, description: 'Initiative updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.welfareService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Delete initiative' })
  @ApiResponse({ status: 200, description: 'Initiative deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.welfareService.remove(id);
  }
}

