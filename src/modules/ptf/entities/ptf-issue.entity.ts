import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Department } from '../../departments/entities/department.entity';
import { District } from '../../departments/entities/district.entity';
import { IssueStatus } from '../../../common/enums';
import type { PtfHistory } from './ptf-history.entity';
import type { PtfResponse } from './ptf-response.entity';

@Entity('ptf_issues')
export class PtfIssue extends AuditableEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'normal' })
  priority: string; // low, normal, high, urgent

  @Column({ nullable: true })
  source: string;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'date', nullable: true })
  timeline: Date;

  @Column({ type: 'enum', enum: IssueStatus, default: IssueStatus.NEW })
  status: IssueStatus;

  @Column({ name: 'primary_department_id', nullable: true })
  primaryDepartmentId: number;

  @Column({ type: 'json', nullable: true, name: 'supporting_departments' })
  supportingDepartments: number[];

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ type: 'text', nullable: true, name: 'expected_outcome' })
  expectedOutcome: string;

  @Column({ name: 'is_closed', default: false })
  isClosed: boolean;

  // Relations
  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district: District;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'primary_department_id' })
  primaryDepartment: Department;

  @OneToMany('PtfHistory', 'ptfIssue')
  history: PtfHistory[];

  @OneToMany('PtfResponse', 'ptfIssue')
  responses: PtfResponse[];
}

