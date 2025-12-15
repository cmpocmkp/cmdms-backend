import { Entity, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';
import type { TaskComment } from './task-comment.entity';

@Entity('tasks')
export class Task extends AuditableEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date', name: 'due_date' })
  dueDate: Date;

  @Column({ default: 'pending' })
  status: string; // pending, in_progress, completed, cancelled

  @Column({ default: 'normal' })
  priority: string; // low, normal, high, urgent

  @Column({ name: 'taskable_type', nullable: true })
  taskableType: string; // minute, directive, announcement_detail, etc.

  @Column({ name: 'taskable_id', nullable: true })
  taskableId: number;

  @Column({ name: 'assigned_to', nullable: true })
  assignedTo: number;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_to' })
  assignee: User;

  @ManyToMany(() => Department)
  @JoinTable({
    name: 'department_task',
    joinColumn: { name: 'task_id' },
    inverseJoinColumn: { name: 'department_id' },
  })
  departments: Department[];

  @OneToMany('TaskComment', 'task')
  comments: TaskComment[];
}

