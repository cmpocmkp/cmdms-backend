import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import {
  CreateDepartmentDto,
  CreateProvinceDto,
  CreateDistrictDto,
  CreateDepartmentTypeDto,
} from './dto/create-department.dto';
import {
  UpdateDepartmentDto,
  UpdateProvinceDto,
  UpdateDistrictDto,
  UpdateDepartmentTypeDto,
} from './dto/update-department.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Roles as RolesEnum } from '../../common/enums';

@ApiTags('departments')
@ApiBearerAuth('JWT-auth')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  // ==================== Departments ====================
  @Post()
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({ status: 201, description: 'Department created successfully' })
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentsService.createDepartment(createDepartmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  @ApiResponse({ status: 200, description: 'Return all departments' })
  findAll() {
    return this.departmentsService.findAllDepartments();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a department by ID' })
  @ApiResponse({ status: 200, description: 'Return the department' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findDepartment(id);
  }

  @Patch(':id')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Update a department' })
  @ApiResponse({ status: 200, description: 'Department updated successfully' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.updateDepartment(id, updateDepartmentDto);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Delete a department' })
  @ApiResponse({ status: 200, description: 'Department deleted successfully' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.removeDepartment(id);
  }

  // ==================== Provinces ====================
  @Post('provinces')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Create a new province' })
  @ApiResponse({ status: 201, description: 'Province created successfully' })
  createProvince(@Body() createProvinceDto: CreateProvinceDto) {
    return this.departmentsService.createProvince(createProvinceDto);
  }

  @Get('provinces/list')
  @ApiOperation({ summary: 'Get all provinces' })
  @ApiResponse({ status: 200, description: 'Return all provinces' })
  findAllProvinces() {
    return this.departmentsService.findAllProvinces();
  }

  @Get('provinces/:id')
  @ApiOperation({ summary: 'Get a province by ID' })
  @ApiResponse({ status: 200, description: 'Return the province' })
  @ApiResponse({ status: 404, description: 'Province not found' })
  findProvince(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findProvince(id);
  }

  @Patch('provinces/:id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Update a province' })
  @ApiResponse({ status: 200, description: 'Province updated successfully' })
  @ApiResponse({ status: 404, description: 'Province not found' })
  updateProvince(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProvinceDto: UpdateProvinceDto,
  ) {
    return this.departmentsService.updateProvince(id, updateProvinceDto);
  }

  @Delete('provinces/:id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Delete a province' })
  @ApiResponse({ status: 200, description: 'Province deleted successfully' })
  @ApiResponse({ status: 404, description: 'Province not found' })
  removeProvince(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.removeProvince(id);
  }

  // ==================== Districts ====================
  @Post('districts')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Create a new district' })
  @ApiResponse({ status: 201, description: 'District created successfully' })
  createDistrict(@Body() createDistrictDto: CreateDistrictDto) {
    return this.departmentsService.createDistrict(createDistrictDto);
  }

  @Get('districts/list')
  @ApiOperation({ summary: 'Get all districts' })
  @ApiResponse({ status: 200, description: 'Return all districts' })
  findAllDistricts() {
    return this.departmentsService.findAllDistricts();
  }

  @Get('districts/:id')
  @ApiOperation({ summary: 'Get a district by ID' })
  @ApiResponse({ status: 200, description: 'Return the district' })
  @ApiResponse({ status: 404, description: 'District not found' })
  findDistrict(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findDistrict(id);
  }

  @Patch('districts/:id')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Update a district' })
  @ApiResponse({ status: 200, description: 'District updated successfully' })
  @ApiResponse({ status: 404, description: 'District not found' })
  updateDistrict(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDistrictDto: UpdateDistrictDto,
  ) {
    return this.departmentsService.updateDistrict(id, updateDistrictDto);
  }

  @Delete('districts/:id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Delete a district' })
  @ApiResponse({ status: 200, description: 'District deleted successfully' })
  @ApiResponse({ status: 404, description: 'District not found' })
  removeDistrict(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.removeDistrict(id);
  }

  // ==================== Department Types ====================
  @Post('types')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Create a new department type' })
  @ApiResponse({
    status: 201,
    description: 'Department type created successfully',
  })
  createDepartmentType(
    @Body() createDepartmentTypeDto: CreateDepartmentTypeDto,
  ) {
    return this.departmentsService.createDepartmentType(
      createDepartmentTypeDto,
    );
  }

  @Get('types/list')
  @ApiOperation({ summary: 'Get all department types' })
  @ApiResponse({ status: 200, description: 'Return all department types' })
  findAllDepartmentTypes() {
    return this.departmentsService.findAllDepartmentTypes();
  }

  @Get('types/:id')
  @ApiOperation({ summary: 'Get a department type by ID' })
  @ApiResponse({ status: 200, description: 'Return the department type' })
  @ApiResponse({ status: 404, description: 'Department type not found' })
  findDepartmentType(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findDepartmentType(id);
  }

  @Patch('types/:id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Update a department type' })
  @ApiResponse({
    status: 200,
    description: 'Department type updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Department type not found' })
  updateDepartmentType(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentTypeDto: UpdateDepartmentTypeDto,
  ) {
    return this.departmentsService.updateDepartmentType(
      id,
      updateDepartmentTypeDto,
    );
  }

  @Delete('types/:id')
  @Roles(RolesEnum.ADMIN)
  @ApiOperation({ summary: 'Delete a department type' })
  @ApiResponse({
    status: 200,
    description: 'Department type deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Department type not found' })
  removeDepartmentType(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.removeDepartmentType(id);
  }
}

