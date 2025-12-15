import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Department } from '../../departments/entities/department.entity';
import { District } from '../../departments/entities/district.entity';
import { IssueType, IssueStatus } from '../../../common/enums';
import type { IssueHistory } from './issue-history.entity';

@Entity('issues')
export class Issue extends AuditableEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: IssueType, default: IssueType.PUBLIC_COMPLAINT })
  type: IssueType;

  @Column({ type: 'enum', enum: IssueStatus, default: IssueStatus.NEW })
  status: IssueStatus;

  @Column({ default: 'normal' })
  priority: string;

  @Column({ nullable: true })
  source: string;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'date', nullable: true })
  timeline: Date;

  @Column({ name: 'primary_department_id', nullable: true })
  primaryDepartmentId: number;

  @Column({ type: 'json', nullable: true, name: 'supporting_departments' })
  supportingDepartments: number[];

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  // Relations
  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district: District;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'primary_department_id' })
  primaryDepartment: Department;

  @OneToMany('IssueHistory', 'issue')
  history: IssueHistory[];
}

