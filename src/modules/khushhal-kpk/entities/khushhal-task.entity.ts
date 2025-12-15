import { Entity, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Department } from '../../departments/entities/department.entity';
import { DecisionStatus } from '../../../common/enums';
import type { KhushhalProgress } from './khushhal-progress.entity';
import type { KhushhalReply } from './khushhal-reply.entity';

@Entity('khushhal_tasks')
export class KhushhalTask extends AuditableEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date', name: 'target_date' })
  targetDate: Date;

  @Column({ type: 'text', nullable: true, name: 'timeline_note' })
  timelineNote: string;

  @Column({ type: 'int', default: DecisionStatus.ON_TARGET })
  status: DecisionStatus;

  @Column({ default: 'normal' })
  priority: string;

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  // Relations
  @ManyToMany(() => Department)
  @JoinTable({
    name: 'khushhal_task_department',
    joinColumn: { name: 'khushhal_task_id' },
    inverseJoinColumn: { name: 'department_id' },
  })
  departments: Department[];

  @OneToMany('KhushhalProgress', 'khushhalTask')
  progress: KhushhalProgress[];

  @OneToMany('KhushhalReply', 'khushhalTask')
  replies: KhushhalReply[];
}

