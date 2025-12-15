import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Department } from '../../departments/entities/department.entity';
import { MeetingType } from './meeting-type.entity';
import type { Minute } from '../../minutes/entities/minute.entity';

@Entity('meetings')
export class Meeting extends AuditableEntity {
  @Column()
  subject: string;

  @Column({ name: 'meeting_date', type: 'date' })
  meetingDate: Date;

  @Column({ nullable: true })
  venue: string;

  @Column({ name: 'department_id' })
  departmentId: number;

  @Column({ name: 'meeting_type_id' })
  meetingTypeId: number;

  @Column({ name: 'serial_number', nullable: true })
  serialNumber: string;

  @Column({ type: 'text', nullable: true })
  participants: string;

  @Column({ type: 'json', nullable: true })
  departments: number[]; // Array of department IDs

  @Column({ type: 'json', nullable: true })
  attachments: string[]; // Array of file names

  @Column({ default: 'upcoming' })
  status: string; // upcoming, held, cancelled

  // Relations
  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => MeetingType)
  @JoinColumn({ name: 'meeting_type_id' })
  meetingType: MeetingType;

  @OneToMany('Minute', 'meeting')
  minutes: Minute[];
}

