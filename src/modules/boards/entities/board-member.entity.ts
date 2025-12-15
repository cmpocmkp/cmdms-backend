import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Board } from './board.entity';
import { BoardMemberType, BoardMemberStatus } from '../../../common/enums';

@Entity('board_members')
export class BoardMember extends AuditableEntity {
  @Column({ name: 'board_id' })
  boardId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  cnic: string;

  @Column({ nullable: true })
  designation: string;

  @Column({ type: 'enum', enum: BoardMemberType })
  type: BoardMemberType; // ex_officio, private

  @Column({ type: 'date', name: 'appointment_date' })
  appointmentDate: Date;

  @Column({ type: 'int', name: 'term_duration_months', nullable: true })
  termDurationMonths: number;

  @Column({ type: 'date', name: 'term_end_date', nullable: true })
  termEndDate: Date;

  @Column({ nullable: true })
  contact: string;

  @Column({ nullable: true })
  organization: string;

  @Column({ type: 'enum', enum: BoardMemberStatus, default: BoardMemberStatus.ACTIVE })
  status: BoardMemberStatus;

  // Relations
  @ManyToOne(() => Board, (board) => board.members)
  @JoinColumn({ name: 'board_id' })
  board: Board;
}

