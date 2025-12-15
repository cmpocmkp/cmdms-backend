import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { DecisionStatus } from '../../../common/enums';
import { Meeting } from '../../meetings/entities/meeting.entity';
import { Department } from '../../departments/entities/department.entity';

@Entity('minutes')
export class Minute extends AuditableEntity {
  @Column({ name: 'meeting_id' })
  meetingId: number;

  @Column({ nullable: true })
  heading: string;

  @Column({ type: 'text' })
  issues: string;

  @Column({ type: 'text' })
  decisions: string;

  @Column({ type: 'text' })
  responsibility: string;

  @Column({ type: 'date' })
  timeline: Date;

  @Column({ name: 'progress_history', type: 'text', nullable: true })
  progressHistory: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'text', nullable: true })
  directions: string;

  @Column({ type: 'int', default: DecisionStatus.ON_TARGET })
  status: DecisionStatus;

  @Column({ type: 'enum', enum: ['Yes', 'No'], default: 'No' })
  completed: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[]; // Max 3 files

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  // Relations
  @ManyToOne(() => Meeting, (meeting) => meeting.minutes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meeting_id' })
  meeting: Meeting;

  @ManyToMany(() => Department)
  @JoinTable({
    name: 'department_minute',
    joinColumn: { name: 'minute_id' },
    inverseJoinColumn: { name: 'department_id' },
  })
  departments: Department[];

  @OneToMany('Reply', 'minute')
  replies: any[];

  @OneToMany('Letter', 'minute')
  letters: any[];
}

