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
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateBoardMeetingDto } from './dto/create-board-meeting.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Roles as RolesEnum } from '../../common/enums';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('boards')
@ApiBearerAuth('JWT-auth')
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Create a new board/committee' })
  @ApiResponse({ status: 201, description: 'Board created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.boardsService.createBoard(createBoardDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all boards' })
  @ApiResponse({ status: 200, description: 'Return all boards' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllBoards() {
    return this.boardsService.findAllBoards();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a board by ID' })
  @ApiResponse({ status: 200, description: 'Return the board' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findBoard(@Param('id', ParseIntPipe) id: number) {
    return this.boardsService.findBoard(id);
  }

  @Post(':id/members')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Add a member to the board' })
  @ApiResponse({ status: 201, description: 'Member added successfully' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  addMember(
    @Param('id', ParseIntPipe) boardId: number,
    @Body() memberDto: any,
    @CurrentUser('id') userId: number,
  ) {
    return this.boardsService.addMember(boardId, memberDto, userId);
  }

  @Post(':id/meetings')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Create a board meeting' })
  @ApiResponse({ status: 201, description: 'Meeting created successfully' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createMeeting(
    @Param('id', ParseIntPipe) boardId: number,
    @Body() createMeetingDto: CreateBoardMeetingDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.boardsService.createMeeting(boardId, createMeetingDto, userId);
  }

  @Get(':id/meetings')
  @ApiOperation({ summary: 'Get all meetings of a board' })
  @ApiResponse({ status: 200, description: 'Return all meetings' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMeetings(@Param('id', ParseIntPipe) boardId: number) {
//     return this.boardsService.getMeetings(boardId);
//   }
// 
//   @Post(':id/acts')
//   @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
//   @ApiOperation({ summary: 'Record a board act/resolution' })
//   @ApiResponse({ status: 201, description: 'Act recorded successfully' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  recordAct(
    @Param('id', ParseIntPipe) boardId: number,
    @Body() actDto: any,
    @CurrentUser('id') userId: number,
  ) {
//     return this.boardsService.recordAct(boardId, actDto, userId);
//   }
// }
// 
