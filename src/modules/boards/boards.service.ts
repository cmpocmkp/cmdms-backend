import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { BoardMember } from './entities/board-member.entity';
import { BoardMeeting } from './entities/board-meeting.entity';
import { BoardAgenda } from './entities/board-agenda.entity';
import { BoardAct } from './entities/board-act.entity';
import { BoardAgendaReply } from './entities/board-agenda-reply.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateBoardMeetingDto } from './dto/create-board-meeting.dto';
import { UpdateBoardMeetingDto } from './dto/update-board-meeting.dto';
import { CreateBoardActDto } from './dto/create-board-act.dto';
import { UpdateBoardActDto } from './dto/update-board-act.dto';
import { CreateBoardAgendaDto } from './dto/create-board-agenda.dto';
import { UpdateBoardAgendaDto } from './dto/update-board-agenda.dto';
import { CreateBoardAgendaReplyDto } from './dto/create-board-agenda-reply.dto';
import { UpdateBoardMemberDto } from './dto/update-board-member.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private boardRepository: Repository<Board>,
    @InjectRepository(BoardMember)
    private memberRepository: Repository<BoardMember>,
    @InjectRepository(BoardMeeting)
    private meetingRepository: Repository<BoardMeeting>,
    @InjectRepository(BoardAgenda)
    private agendaRepository: Repository<BoardAgenda>,
    @InjectRepository(BoardAct)
    private actRepository: Repository<BoardAct>,
    @InjectRepository(BoardAgendaReply)
    private replyRepository: Repository<BoardAgendaReply>,
  ) { }

  async createBoard(createBoardDto: CreateBoardDto, createdBy: number): Promise<Board> {
    const board = this.boardRepository.create({
      ...createBoardDto,
      createdBy,
    });
    return await this.boardRepository.save(board);
  }

  async findAllBoards(): Promise<Board[]> {
    return await this.boardRepository.find({
      where: { isActive: true },
      relations: ['parentDepartment', 'members', 'meetings'],
    });
  }

  async findBoard(id: number): Promise<Board> {
    const board = await this.boardRepository.findOne({
      where: { id },
      relations: ['parentDepartment', 'members', 'meetings', 'acts'],
    });

    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    return board;
  }

  // --- Board Meetings ---

  async createMeeting(createMeetingDto: CreateBoardMeetingDto, createdBy: number): Promise<BoardMeeting> {
    const { agendaItems, ...meetingData } = createMeetingDto;

    const meeting = this.meetingRepository.create({
      ...meetingData,
      createdBy,
    });

    const savedMeeting = await this.meetingRepository.save(meeting);

    // Create agenda items if provided
    if (agendaItems && agendaItems.length > 0) {
      for (const item of agendaItems) {
        await this.agendaRepository.save({
          ...item,
          boardMeetingId: savedMeeting.id,
          createdBy,
        });
      }
    }

    return savedMeeting;
  }

  async findMeetingsByBoard(boardId: number): Promise<BoardMeeting[]> {
    return await this.meetingRepository.find({
      where: { boardId },
      relations: ['board', 'department', 'agendaItems'],
      order: { date: 'DESC' },
    });
  }

  async findMeeting(id: number): Promise<BoardMeeting> {
    const meeting = await this.meetingRepository.findOne({
      where: { id },
      relations: ['board', 'department', 'agendaItems', 'agendaItems.primaryDepartment', 'agendaItems.relatedDepartments'],
    });

    if (!meeting) {
      throw new NotFoundException(`Meeting with ID ${id} not found`);
    }
    return meeting;
  }

  async updateMeeting(id: number, updateDto: UpdateBoardMeetingDto, userId: number): Promise<BoardMeeting> {
    const meeting = await this.findMeeting(id);

    // Separate agenda items if present
    const { agendaItems, ...data } = updateDto as any; // Cast to access potential agendaItems if passed, though UpdateDTO might not have it structured same way

    Object.assign(meeting, data);
    meeting.modifiedBy = userId;

    return await this.meetingRepository.save(meeting);
  }

  async removeMeeting(id: number): Promise<void> {
    const result = await this.meetingRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Meeting with ID ${id} not found`);
    }
  }

  // --- Board Members ---

  async getMembers(boardId: number): Promise<BoardMember[]> {
    return await this.memberRepository.find({
      where: { boardId },
      relations: ['user', 'user.department'], // Assuming user relation exists or pertinent
    });
  }

  async getMember(id: number): Promise<BoardMember> {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) throw new NotFoundException(`Member with ID ${id} not found`);
    return member;
  }

  async addMember(boardId: number, memberData: any, createdBy: number): Promise<BoardMember> {
    const member = this.memberRepository.create({
      boardId,
      ...memberData,
      createdBy,
    });
    return await this.memberRepository.save(member) as unknown as BoardMember;
  }

  async updateMember(id: number, memberData: any, userId: number): Promise<BoardMember> {
    const member = await this.getMember(id);
    Object.assign(member, memberData);
    member.modifiedBy = userId;
    return await this.memberRepository.save(member);
  }

  async removeMember(id: number): Promise<void> {
    const result = await this.memberRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Member with ID ${id} not found`);
  }

  // --- Board Acts ---

  async getActs(boardId: number): Promise<BoardAct[]> {
    return await this.actRepository.find({
      where: { boardId },
      relations: ['responsibleDepartment'],
      order: { date: 'DESC' }
    });
  }

  async getAct(id: number): Promise<BoardAct> {
    const act = await this.actRepository.findOne({
      where: { id },
      relations: ['responsibleDepartment']
    });
    if (!act) throw new NotFoundException(`Act with ID ${id} not found`);
    return act;
  }

  async createAct(actData: CreateBoardActDto & { boardId: number }, createdBy: number): Promise<BoardAct> {
    const act = this.actRepository.create({
      ...actData,
      createdBy,
    });
    return await this.actRepository.save(act) as unknown as BoardAct;
  }

  async updateAct(id: number, updateDto: UpdateBoardActDto, userId: number): Promise<BoardAct> {
    const act = await this.getAct(id);
    Object.assign(act, updateDto);
    act.modifiedBy = userId;
    return await this.actRepository.save(act);
  }

  async removeAct(id: number): Promise<void> {
    const result = await this.actRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Act with ID ${id} not found`);
  }

  // --- Agenda Points ---

  async getAgendaPoints(meetingId: number): Promise<BoardAgenda[]> {
    return await this.agendaRepository.find({
      where: { boardMeetingId: meetingId },
      relations: ['primaryDepartment', 'relatedDepartments']
    });
  }

  async getAgendaPoint(id: number): Promise<BoardAgenda> {
    const point = await this.agendaRepository.findOne({
      where: { id },
      relations: ['primaryDepartment', 'relatedDepartments']
    });
    if (!point) throw new NotFoundException(`Agenda point with ID ${id} not found`);
    return point;
  }

  async createAgendaPoint(data: CreateBoardAgendaDto & { boardMeetingId: number }, createdBy: number): Promise<BoardAgenda> {
    const { relatedDepartmentIds, ...rest } = data;
    const point = this.agendaRepository.create({
      ...rest,
      createdBy,
    });

    // Handle specific relations if needed outside of create
    // Depending on cascade or manual setting

    return await this.agendaRepository.save(point);
  }

  async updateAgendaPoint(id: number, updateDto: UpdateBoardAgendaDto, userId: number): Promise<BoardAgenda> {
    const point = await this.getAgendaPoint(id);
    const { relatedDepartmentIds, ...rest } = updateDto;

    Object.assign(point, rest);
    point.modifiedBy = userId;

    // If related depts updated, handled here

    return await this.agendaRepository.save(point);
  }

  async removeAgendaPoint(id: number): Promise<void> {
    const result = await this.agendaRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Agenda point with ID ${id} not found`);
  }

  // --- Agenda Replies ---

  async getAgendaReplies(agendaId: number): Promise<BoardAgendaReply[]> {
    return await this.replyRepository.find({
      where: { boardAgendaId: agendaId },
      relations: ['user'],
      order: { createdAt: 'ASC' }
    });
  }

  async addAgendaReply(agendaId: number, data: CreateBoardAgendaReplyDto, userId: number): Promise<BoardAgendaReply> {
    const reply = this.replyRepository.create({
      boardAgendaId: agendaId,
      ...data,
      createdBy: userId,
    });
    return await this.replyRepository.save(reply) as unknown as BoardAgendaReply;
  }
}

