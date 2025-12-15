import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PtfIssue } from './ptf-issue.entity';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';

@Entity('ptf_responses')
export class PtfResponse extends BaseEntity {
  @Column({ name: 'ptf_issue_id' })
  ptfIssueId: number;

  @Column({ name: 'department_id' })
  departmentId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'text' })
  response: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  // Relations
  @ManyToOne(() => PtfIssue, (issue) => issue.responses)
  @JoinColumn({ name: 'ptf_issue_id' })
  ptfIssue: PtfIssue;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

