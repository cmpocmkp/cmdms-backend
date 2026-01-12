import { Entity, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn, OneToMany } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { BoardMeeting } from './board-meeting.entity';
import { Department } from '../../departments/entities/department.entity';
import { DecisionStatus } from '../../../common/enums';

@Entity('board_agendas')
export class BoardAgenda extends AuditableEntity {
  @Column({ name: 'board_meeting_id' })
  boardMeetingId: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  decision: string;

  @Column({ type: 'date', nullable: true })
  timeline: Date;

  @Column({ type: 'int', default: DecisionStatus.ON_TARGET })
  status: DecisionStatus;

  @Column({ type: 'text', nullable: true })
  highlights: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  @Column({ name: 'primary_department_id', nullable: true })
  primaryDepartmentId: number;

  // Relations
  @ManyToOne(() => BoardMeeting, (meeting) => meeting.agendaItems)
  @JoinColumn({ name: 'board_meeting_id' })
  boardMeeting: BoardMeeting;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'primary_department_id' })
  primaryDepartment: Department;

  @ManyToMany(() => Department)
  @JoinTable({
    name: 'board_agenda_department',
    joinColumn: { name: 'board_agenda_id' },
    inverseJoinColumn: { name: 'department_id' },
  })
  relatedDepartments: Department[];

  @OneToMany('BoardAgendaReply', 'boardAgenda')
  replies: any[];
}

