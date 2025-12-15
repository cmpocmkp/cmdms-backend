import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Department } from '../../departments/entities/department.entity';
import type { SectorialAgenda } from './sectorial-agenda.entity';

@Entity('sectorial_meetings')
export class SectorialMeeting extends AuditableEntity {
  @Column()
  sector: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  venue: string;

  @Column({ name: 'meeting_number', nullable: true })
  meetingNumber: string;

  @Column({ nullable: true })
  subject: string;

  @Column({ type: 'text', nullable: true })
  participants: string;

  @Column({ name: 'chairperson', nullable: true })
  chairperson: string;

  @Column({ name: 'department_id' })
  departmentId: number;

  // Relations
  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany('SectorialAgenda', 'sectorialMeeting')
  agendaItems: SectorialAgenda[];
}

