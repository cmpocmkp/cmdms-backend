import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { BoardMember } from './entities/board-member.entity';
import { BoardMeeting } from './entities/board-meeting.entity';
import { BoardAgenda } from './entities/board-agenda.entity';
import { BoardAct } from './entities/board-act.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateBoardMeetingDto } from './dto/create-board-meeting.dto';

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
  ) {}

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

  async addMember(boardId: number, memberData: any, createdBy: number): Promise<BoardMember> {
    const member = this.memberRepository.create({
      boardId,
      ...memberData,
      createdBy,
    });
    return await this.memberRepository.save(member) as unknown as BoardMember;
  }

  async createAct(actData: any, createdBy: number): Promise<BoardAct> {
    const act = this.actRepository.create({
      ...actData,
      createdBy,
    });
    return await this.actRepository.save(act) as unknown as BoardAct;
  }
}

