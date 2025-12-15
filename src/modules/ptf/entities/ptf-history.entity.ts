import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PtfIssue } from './ptf-issue.entity';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';
import { IssueStatus } from '../../../common/enums';

@Entity('ptf_history')
export class PtfHistory extends BaseEntity {
  @Column({ name: 'ptf_issue_id' })
  ptfIssueId: number;

  @Column({ type: 'date', name: 'action_date' })
  actionDate: Date;

  @Column({ name: 'action_type' })
  actionType: string; // created, assigned, status_changed, cm_decision, closed, reopened, escalated

  @Column({ name: 'department_id', nullable: true })
  departmentId: number;

  @Column({ type: 'enum', enum: IssueStatus, nullable: true })
  status: IssueStatus;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'text', nullable: true, name: 'cm_decision' })
  cmDecision: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @Column({ name: 'user_id' })
  userId: number;

  // Relations
  @ManyToOne(() => PtfIssue, (issue) => issue.history)
  @JoinColumn({ name: 'ptf_issue_id' })
  ptfIssue: PtfIssue;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

