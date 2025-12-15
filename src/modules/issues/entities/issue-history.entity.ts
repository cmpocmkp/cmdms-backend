import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Issue } from './issue.entity';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';
import { IssueStatus } from '../../../common/enums';

@Entity('issue_history')
export class IssueHistory extends BaseEntity {
  @Column({ name: 'issue_id' })
  issueId: number;

  @Column({ type: 'date', name: 'action_date' })
  actionDate: Date;

  @Column({ name: 'action_type' })
  actionType: string; // assigned, status_changed, updated, escalated, closed

  @Column({ name: 'department_id', nullable: true })
  departmentId: number;

  @Column({ type: 'enum', enum: IssueStatus, nullable: true })
  status: IssueStatus;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @Column({ name: 'user_id' })
  userId: number;

  // Relations
  @ManyToOne(() => Issue, (issue) => issue.history)
  @JoinColumn({ name: 'issue_id' })
  issue: Issue;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

