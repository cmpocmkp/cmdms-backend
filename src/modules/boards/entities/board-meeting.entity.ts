import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Board } from './board.entity';
import { Department } from '../../departments/entities/department.entity';
import type { BoardAgenda } from './board-agenda.entity';

@Entity('board_meetings')
export class BoardMeeting extends AuditableEntity {
  @Column({ name: 'board_id' })
  boardId: number;

  @Column({ name: 'sequence_number' })
  sequenceNumber: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  venue: string;

  @Column({ name: 'meeting_type', default: 'regular' })
  meetingType: string; // regular, special, emergency

  @Column({ type: 'text', nullable: true })
  participants: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @Column({ name: 'department_id', nullable: true })
  departmentId: number;

  // Relations
  @ManyToOne(() => Board, (board) => board.meetings)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany('BoardAgenda', 'boardMeeting')
  agendaItems: BoardAgenda[];
}

