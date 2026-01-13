import { Entity, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Department } from '../../departments/entities/department.entity';
import { DecisionStatus } from '../../../common/enums';
import type { KhushhalProgress } from './khushhal-progress.entity';
import type { KhushhalReply } from './khushhal-reply.entity';
import { KhushhalTaskAssignment } from './khushhal-task-assignment.entity';

@Entity('khushhal_tasks')
export class KhushhalTask extends AuditableEntity {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true, name: 'subject_tasks' })
  subjectTasks: string;

  @Column({ type: 'text', nullable: true, name: 'progress_so_far' })
  progressSoFar: string;

  @Column({ type: 'text', nullable: true, name: 'expected_outcomes' })
  expectedOutcomes: string;

  @Column({ type: 'text', nullable: true, name: 'action_by_note' })
  actionByNote: string;

  @Column({ type: 'date', name: 'target_date', nullable: true })
  targetDate: Date;

  @Column({ type: 'date', name: 'timeline_date', nullable: true })
  timelineDate: Date;

  @Column({ type: 'text', nullable: true, name: 'timeline_note' })
  timelineNote: string;

  @Column({ type: 'int', default: DecisionStatus.ON_TARGET })
  status: DecisionStatus;

  @Column({ default: 'normal' })
  priority: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  // Relations
  @OneToMany(() => KhushhalTaskAssignment, (assignment) => assignment.khushhalTask, { cascade: true })
  assignments: KhushhalTaskAssignment[];

  // Helper for direct access if needed, utilizing the same table? No, difficult with TypeORM.
  // We will expose departments via 'assignments' properties.

  @OneToMany('KhushhalProgress', 'khushhalTask')
  progress: KhushhalProgress[];

  @OneToMany('KhushhalReply', 'khushhalTask')
  replies: KhushhalReply[];
}
