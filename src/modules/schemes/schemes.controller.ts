import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SchemesService } from './schemes.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Roles as RolesEnum } from '../../common/enums';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('schemes')
@ApiBearerAuth('JWT-auth')
@Controller('schemes')
export class SchemesController {
  constructor(private readonly schemesService: SchemesService) {}

  @Post()
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Create a new development scheme' })
  @ApiResponse({ status: 201, description: 'Scheme created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createScheme(
    @Body() createSchemeDto: any,
    @CurrentUser('id') userId: number,
  ) {
    return this.schemesService.createScheme(createSchemeDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all development schemes' })
  @ApiResponse({ status: 200, description: 'Return all schemes' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.schemesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a scheme by ID' })
  @ApiResponse({ status: 200, description: 'Return the scheme' })
  @ApiResponse({ status: 404, description: 'Scheme not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.schemesService.findOne(id);
  }

  @Post(':id/costing')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Add costing to scheme' })
  @ApiResponse({ status: 201, description: 'Costing added successfully' })
  @ApiResponse({ status: 404, description: 'Scheme not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  addCosting(
    @Param('id', ParseIntPipe) schemeId: number,
    @Body() costingDto: any,
  ) {
    return this.schemesService.addCosting(schemeId, costingDto);
  }

  @Post(':id/budget')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Add budget allocation to scheme' })
  @ApiResponse({ status: 201, description: 'Budget added successfully' })
  @ApiResponse({ status: 404, description: 'Scheme not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  addBudget(
    @Param('id', ParseIntPipe) schemeId: number,
    @Body() budgetDto: any,
  ) {
    return this.schemesService.addBudget(schemeId, budgetDto);
  }

  @Post(':id/expenditure')
  @ApiOperation({ summary: 'Record expenditure for scheme' })
  @ApiResponse({ status: 201, description: 'Expenditure recorded successfully' })
  @ApiResponse({ status: 404, description: 'Scheme not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  addExpenditure(
    @Param('id', ParseIntPipe) schemeId: number,
    @Body() expenditureDto: any,
  ) {
    return this.schemesService.addExpenditure(schemeId, expenditureDto);
  }

  @Post(':id/revision')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Add revision to scheme' })
  @ApiResponse({ status: 201, description: 'Revision added successfully' })
  @ApiResponse({ status: 404, description: 'Scheme not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  addRevision(
    @Param('id', ParseIntPipe) schemeId: number,
    @Body() revisionDto: any,
  ) {
    return this.schemesService.addRevision(schemeId, revisionDto);
  }

  // Advanced feature - to be implemented
  // @Get(':id/financial-progress')
  // @ApiOperation({ summary: 'Get financial progress of scheme' })
  // getFinancialProgress(@Param('id', ParseIntPipe) schemeId: number) {
  //   return this.schemesService.getFinancialProgress(schemeId);
  // }
}
