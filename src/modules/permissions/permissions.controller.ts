import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Roles as RolesEnum } from '../../common/enums';

@ApiTags('permissions')
@ApiBearerAuth('JWT-auth')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: 201, description: 'Permission created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category',
  })
  @ApiResponse({ status: 200, description: 'Return all permissions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.permissionsService.findByCategory(category);
    }
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a permission by ID' })
  @ApiResponse({ status: 200, description: 'Return the permission' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Update a permission' })
  @ApiResponse({
    status: 200,
    description: 'Permission updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Delete a permission' })
  @ApiResponse({
    status: 200,
    description: 'Permission deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.remove(id);
  }
}

