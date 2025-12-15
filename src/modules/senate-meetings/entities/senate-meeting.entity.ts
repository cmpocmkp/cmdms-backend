import { Entity, Column, OneToMany } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import type { SenateMinute } from './senate-minute.entity';

@Entity('senate_meetings')
export class SenateMeeting extends AuditableEntity {
  @Column({ name: 'university_name' })
  universityName: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  venue: string;

  @Column({ name: 'meeting_number', nullable: true })
  meetingNumber: string;

  @Column({ type: 'text', nullable: true })
  attendees: string;

  @Column({ name: 'quorum_met', default: true })
  quorumMet: boolean;

  @OneToMany('SenateMinute', 'senateMeeting')
  minutes: SenateMinute[];
}

