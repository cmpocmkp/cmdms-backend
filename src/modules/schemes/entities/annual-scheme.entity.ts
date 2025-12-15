import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Department } from '../../departments/entities/department.entity';
import { District } from '../../departments/entities/district.entity';
import { SchemeStatus, SchemeType } from '../../../common/enums';
import type { SchemeCosting } from './scheme-costing.entity';
import type { SchemeBudget } from './scheme-budget.entity';
import type { SchemeExpenditure } from './scheme-expenditure.entity';
import type { SchemeRevision } from './scheme-revision.entity';

@Entity('annual_schemes')
export class AnnualScheme extends AuditableEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column()
  sector: string;

  @Column({ nullable: true, name: 'sub_sector' })
  subSector: string;

  @Column({ name: 'department_id' })
  departmentId: number;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'estimated_cost' })
  estimatedCost: number;

  @Column({ type: 'enum', enum: SchemeStatus, default: SchemeStatus.PENDING })
  status: SchemeStatus;

  @Column({ type: 'enum', enum: SchemeType, default: SchemeType.ANNUAL })
  type: SchemeType;

  @Column({ type: 'date', nullable: true, name: 'approval_date' })
  approvalDate: Date;

  @Column({ type: 'date', nullable: true, name: 'start_date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true, name: 'completion_date' })
  completionDate: Date;

  @Column({ type: 'int', default: 0, name: 'progress_percentage' })
  progressPercentage: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true, name: 'linked_mpa_mna' })
  linkedMpaMna: string;

  @Column({ name: 'is_mega', default: false })
  isMega: boolean;

  @Column({ name: 'is_distributed', default: false })
  isDistributed: boolean;

  // Relations
  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district: District;

  @OneToMany('SchemeCosting', 'scheme')
  costings: SchemeCosting[];

  @OneToMany('SchemeBudget', 'scheme')
  budgets: SchemeBudget[];

  @OneToMany('SchemeExpenditure', 'scheme')
  expenditures: SchemeExpenditure[];

  @OneToMany('SchemeRevision', 'scheme')
  revisions: SchemeRevision[];
}

