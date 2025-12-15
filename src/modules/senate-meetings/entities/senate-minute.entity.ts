import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { SenateMeeting } from './senate-meeting.entity';

@Entity('senate_minutes')
export class SenateMinute extends AuditableEntity {
  @Column({ name: 'senate_meeting_id' })
  senateMeetingId: number;

  @Column({ name: 'agenda_item' })
  agendaItem: string;

  @Column({ type: 'text', nullable: true })
  discussion: string;

  @Column({ type: 'text', nullable: true })
  decision: string;

  @Column({ name: 'responsible_person', nullable: true })
  responsiblePerson: string;

  @Column({ type: 'date', nullable: true })
  timeline: Date;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  // Relations
  @ManyToOne(() => SenateMeeting, (meeting) => meeting.minutes)
  @JoinColumn({ name: 'senate_meeting_id' })
  senateMeeting: SenateMeeting;
}

