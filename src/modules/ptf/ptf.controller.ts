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
import { PtfService } from './ptf.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Roles as RolesEnum } from '../../common/enums';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('ptf')
@ApiBearerAuth('JWT-auth')
@Controller('ptf')
export class PtfController {
  constructor(private readonly ptfService: PtfService) {}

  @Post('issues')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Create a new PTF issue' })
  @ApiResponse({ status: 201, description: 'PTF issue created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createIssue(
    @Body() createIssueDto: any,
    @CurrentUser('id') userId: number,
  ) {
    return this.ptfService.createIssue(createIssueDto, userId);
  }

  @Get('issues')
  @ApiOperation({ summary: 'Get all PTF issues' })
  @ApiResponse({ status: 200, description: 'Return all PTF issues' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.ptfService.findAll();
  }

  @Get('issues/:id')
  @ApiOperation({ summary: 'Get a PTF issue by ID' })
  @ApiResponse({ status: 200, description: 'Return the PTF issue' })
  @ApiResponse({ status: 404, description: 'PTF issue not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ptfService.findOne(id);
  }


  // Advanced features - to be implemented
  // @Post('issues/:id/response')
  // @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  // @ApiOperation({ summary: 'Add response to PTF issue' })
  // addResponse(@Param('id', ParseIntPipe) issueId: number, @Body() responseDto: any, @CurrentUser('id') userId: number) {
  //   return this.ptfService.addResponse(issueId, responseDto, userId);
  // }

  @Post('meetings')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Create a PTF meeting' })
  @ApiResponse({ status: 201, description: 'PTF meeting created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createMeeting(
    @Body() createMeetingDto: any,
    @CurrentUser('id') userId: number,
  ) {
    return this.ptfService.createMeeting(createMeetingDto, userId);
  }
}
