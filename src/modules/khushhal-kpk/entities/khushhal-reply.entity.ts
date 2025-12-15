import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { KhushhalTask } from './khushhal-task.entity';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';

@Entity('khushhal_replies')
export class KhushhalReply extends BaseEntity {
  @Column({ name: 'khushhal_task_id' })
  khushhalTaskId: number;

  @Column({ name: 'department_id' })
  departmentId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'text' })
  reply: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @Column({ name: 'is_admin_reply', default: false })
  isAdminReply: boolean;

  // Relations
  @ManyToOne(() => KhushhalTask, (task) => task.replies)
  @JoinColumn({ name: 'khushhal_task_id' })
  khushhalTask: KhushhalTask;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

