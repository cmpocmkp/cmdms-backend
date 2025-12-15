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
import { DirectivesService } from './directives.service';
import { CreateDirectiveDto } from './dto/create-directive.dto';
import { UpdateDirectiveDto } from './dto/update-directive.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('directives')
@ApiBearerAuth('JWT-auth')
@Controller('directives')
@UseGuards(JwtAuthGuard)
export class DirectivesController {
  constructor(private readonly directivesService: DirectivesService) {}

  @Post()
  async create(
    @Body() createDirectiveDto: CreateDirectiveDto,
    @CurrentUser('id') userId: number,
  ) {
    const directive = await this.directivesService.create(createDirectiveDto, userId);
    return ResponseDto.success(directive, 'Directive created successfully');
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.directivesService.findAll(paginationDto);
    return ResponseDto.success(result.data, undefined, result.metadata);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const directive = await this.directivesService.findOne(id);
    return ResponseDto.success(directive);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDirectiveDto: UpdateDirectiveDto,
    @CurrentUser('id') userId: number,
  ) {
    const directive = await this.directivesService.update(id, updateDirectiveDto, userId);
    return ResponseDto.success(directive, 'Directive updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.directivesService.remove(id);
    return ResponseDto.success(null, 'Directive deleted successfully');
  }

  @Post(':id/responses')
  async submitResponse(
    @Param('id', ParseIntPipe) id: number,
    @Body('response') response: string,
    @CurrentUser('id') userId: number,
    @CurrentUser('departmentId') departmentId: number,
  ) {
    const directiveResponse = await this.directivesService.submitResponse(id, departmentId, userId, response);
    return ResponseDto.success(directiveResponse, 'Response submitted successfully');
  }
}

