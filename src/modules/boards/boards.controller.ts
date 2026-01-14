import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateBoardMeetingDto } from './dto/create-board-meeting.dto';
import { UpdateBoardMeetingDto } from './dto/update-board-meeting.dto';
import { CreateBoardActDto } from './dto/create-board-act.dto';
import { UpdateBoardActDto } from './dto/update-board-act.dto';
import { UpdateBoardMemberDto } from './dto/update-board-member.dto';
import { CreateBoardAgendaDto } from './dto/create-board-agenda.dto';
import { UpdateBoardAgendaDto } from './dto/update-board-agenda.dto';
import { CreateBoardAgendaReplyDto } from './dto/create-board-agenda-reply.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Roles as RolesEnum } from '../../common/enums';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ResponseDto } from '../../common/dto/response.dto';

@ApiTags('boards')
@ApiBearerAuth('JWT-auth')
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) { }

  @Post()
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Create a new board/committee' })
  @ApiResponse({ status: 201, description: 'Board created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @CurrentUser('id') userId: number,
  ) {
    const board = await this.boardsService.createBoard(createBoardDto, userId);
    return ResponseDto.success(board, 'Board created successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get all boards' })
  @ApiResponse({ status: 200, description: 'Return all boards' })
  async findAllBoards() {
    const boards = await this.boardsService.findAllBoards();
    return ResponseDto.success(boards);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a board by ID' })
  async findBoard(@Param('id', ParseIntPipe) id: number) {
    const board = await this.boardsService.findBoard(id);
    return ResponseDto.success(board);
  }

  // --- Members ---

  @Get(':id/members')
  @ApiOperation({ summary: 'Get all members of a board' })
  @ApiResponse({ status: 200, description: 'List of board members with user details' })
  async getMembers(@Param('id', ParseIntPipe) boardId: number) {
    const members = await this.boardsService.getMembers(boardId);
    return ResponseDto.success(members);
  }

  @Get(':id/members/:memberId')
  @ApiOperation({ summary: 'Get a specific board member' })
  async getMember(@Param('memberId', ParseIntPipe) memberId: number) {
    const member = await this.boardsService.getMember(memberId);
    return ResponseDto.success(member);
  }

  @Post(':id/members')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Add a member to the board' })
  async addMember(
    @Param('id', ParseIntPipe) boardId: number,
    @Body() memberDto: any,
    @CurrentUser('id') userId: number,
  ) {
    const member = await this.boardsService.addMember(boardId, memberDto, userId);
    return ResponseDto.success(member, 'Member added successfully');
  }

  @Patch(':id/members/:memberId')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Update a board member' })
  async updateMember(
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() memberDto: UpdateBoardMemberDto,
    @CurrentUser('id') userId: number,
  ) {
    const member = await this.boardsService.updateMember(memberId, memberDto, userId);
    return ResponseDto.success(member, 'Member updated successfully');
  }

  @Delete(':id/members/:memberId')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Remove a board member' })
  async removeMember(@Param('memberId', ParseIntPipe) memberId: number) {
    await this.boardsService.removeMember(memberId);
    return ResponseDto.success(null, 'Member removed successfully');
  }

  // --- Meetings ---

  @Post(':id/meetings')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Create a board meeting' })
  async createMeeting(
    @Param('id', ParseIntPipe) boardId: number,
    @Body() createMeetingDto: CreateBoardMeetingDto,
    @CurrentUser('id') userId: number,
  ) {
    const meeting = await this.boardsService.createMeeting({ ...createMeetingDto, boardId }, userId);
    return ResponseDto.success(meeting, 'Meeting created successfully');
  }

  @Get(':id/meetings')
  @ApiOperation({ summary: 'Get all meetings of a board' })
  async getMeetings(@Param('id', ParseIntPipe) boardId: number) {
    const meetings = await this.boardsService.findMeetingsByBoard(boardId);
    return ResponseDto.success(meetings);
  }

  @Get(':id/meetings/:meetingId')
  @ApiOperation({ summary: 'Get a specific meeting' })
  @ApiResponse({ status: 200, description: 'Board meeting details' })
  async getMeeting(@Param('meetingId', ParseIntPipe) meetingId: number) {
    const meeting = await this.boardsService.findMeeting(meetingId);
    return ResponseDto.success(meeting);
  }

  @Patch(':id/meetings/:meetingId')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Update a meeting' })
  async updateMeeting(
    @Param('meetingId', ParseIntPipe) meetingId: number,
    @Body() updateDto: UpdateBoardMeetingDto,
    @CurrentUser('id') userId: number,
  ) {
    const meeting = await this.boardsService.updateMeeting(meetingId, updateDto, userId);
    return ResponseDto.success(meeting, 'Meeting updated successfully');
  }

  @Delete(':id/meetings/:meetingId')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Delete a meeting' })
  async removeMeeting(@Param('meetingId', ParseIntPipe) meetingId: number) {
    await this.boardsService.removeMeeting(meetingId);
    return ResponseDto.success(null, 'Meeting deleted successfully');
  }

  // --- Acts ---

  @Get(':id/acts')
  @ApiOperation({ summary: 'Get all acts of a board' })
  async getActs(@Param('id', ParseIntPipe) boardId: number) {
    const acts = await this.boardsService.getActs(boardId);
    return ResponseDto.success(acts);
  }

  @Get(':id/acts/:actId')
  @ApiOperation({ summary: 'Get a specific act' })
  @ApiResponse({ status: 200, description: 'Board act details including responsible department' })
  async getAct(@Param('actId', ParseIntPipe) actId: number) {
    const act = await this.boardsService.getAct(actId);
    return ResponseDto.success(act);
  }

  @Post(':id/acts')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Record a board act/resolution' })
  @ApiResponse({ status: 201, description: 'Act recorded successfully' })
  async createAct(
    @Param('id', ParseIntPipe) boardId: number,
    @Body() actDto: CreateBoardActDto,
    @CurrentUser('id') userId: number,
  ) {
    const act = await this.boardsService.createAct({ ...actDto, boardId }, userId);
    return ResponseDto.success(act, 'Act recorded successfully');
  }

  @Patch(':id/acts/:actId')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Update a board act' })
  async updateAct(
    @Param('actId', ParseIntPipe) actId: number,
    @Body() updateDto: UpdateBoardActDto,
    @CurrentUser('id') userId: number,
  ) {
    const act = await this.boardsService.updateAct(actId, updateDto, userId);
    return ResponseDto.success(act, 'Act updated successfully');
  }

  @Delete(':id/acts/:actId')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Delete a board act' })
  async removeAct(@Param('actId', ParseIntPipe) actId: number) {
    await this.boardsService.removeAct(actId);
    return ResponseDto.success(null, 'Act deleted successfully');
  }

  // --- Agenda Points ---

  @Get(':id/meetings/:meetingId/agenda-points')
  @ApiOperation({ summary: 'Get agenda points for a meeting' })
  async getAgendaPoints(@Param('meetingId', ParseIntPipe) meetingId: number) {
    const points = await this.boardsService.getAgendaPoints(meetingId);
    return ResponseDto.success(points);
  }

  @Get(':id/meetings/:meetingId/agenda-points/:pointId')
  @ApiOperation({ summary: 'Get specific agenda point' })
  async getAgendaPoint(@Param('pointId', ParseIntPipe) pointId: number) {
    const point = await this.boardsService.getAgendaPoint(pointId);
    return ResponseDto.success(point);
  }

  @Post(':id/meetings/:meetingId/agenda-points')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Create an agenda point' })
  async createAgendaPoint(
    @Param('meetingId', ParseIntPipe) meetingId: number,
    @Body() createDto: CreateBoardAgendaDto,
    @CurrentUser('id') userId: number,
  ) {
    const point = await this.boardsService.createAgendaPoint({ ...createDto, boardMeetingId: meetingId }, userId);
    return ResponseDto.success(point, 'Agenda point created successfully');
  }

  @Patch(':id/meetings/:meetingId/agenda-points/:pointId')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Update an agenda point' })
  async updateAgendaPoint(
    @Param('pointId', ParseIntPipe) pointId: number,
    @Body() updateDto: UpdateBoardAgendaDto,
    @CurrentUser('id') userId: number,
  ) {
    const point = await this.boardsService.updateAgendaPoint(pointId, updateDto, userId);
    return ResponseDto.success(point, 'Agenda point updated successfully');
  }

  @Delete(':id/meetings/:meetingId/agenda-points/:pointId')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Delete an agenda point' })
  async removeAgendaPoint(@Param('pointId', ParseIntPipe) pointId: number) {
    await this.boardsService.removeAgendaPoint(pointId);
    return ResponseDto.success(null, 'Agenda point deleted successfully');
  }

  @Get(':id/meetings/:meetingId/agenda-points/:pointId/replies')
  @ApiOperation({ summary: 'Get replies for an agenda point' })
  async getAgendaReplies(@Param('pointId', ParseIntPipe) pointId: number) {
    const replies = await this.boardsService.getAgendaReplies(pointId);
    return ResponseDto.success(replies);
  }

  @Post(':id/meetings/:meetingId/agenda-points/:pointId/replies')
  @Roles(RolesEnum.ADMIN, RolesEnum.DEPARTMENT)
  @ApiOperation({ summary: 'Add reply to an agenda point' })
  async addAgendaReply(
    @Param('pointId', ParseIntPipe) pointId: number,
    @Body() replyDto: CreateBoardAgendaReplyDto,
    @CurrentUser('id') userId: number,
  ) {
    const reply = await this.boardsService.addAgendaReply(pointId, replyDto, userId);
    return ResponseDto.success(reply, 'Reply added successfully');
  }
}

