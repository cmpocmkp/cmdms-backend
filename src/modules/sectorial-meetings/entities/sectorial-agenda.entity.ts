import { Entity, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn, OneToMany } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { SectorialMeeting } from './sectorial-meeting.entity';
import { Department } from '../../departments/entities/department.entity';
import { DecisionStatus } from '../../../common/enums';

@Entity('sectorial_agendas')
export class SectorialAgenda extends AuditableEntity {
  @Column({ name: 'sectorial_meeting_id' })
  sectorialMeetingId: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  decision: string;

  @Column({ type: 'date', nullable: true })
  timeline: Date;

  @Column({ type: 'int', default: DecisionStatus.ON_TARGET })
  status: DecisionStatus;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @Column({ name: 'linked_scheme_id', nullable: true })
  linkedSchemeId: number;

  // Relations
  @ManyToOne(() => SectorialMeeting, (meeting) => meeting.agendaItems)
  @JoinColumn({ name: 'sectorial_meeting_id' })
  sectorialMeeting: SectorialMeeting;

  @ManyToMany(() => Department)
  @JoinTable({
    name: 'sectorial_agenda_department',
    joinColumn: { name: 'sectorial_agenda_id' },
    inverseJoinColumn: { name: 'department_id' },
  })
  departments: Department[];

  @OneToMany('SectorialAgendaReply', 'sectorialAgenda')
  replies: any[];
}

