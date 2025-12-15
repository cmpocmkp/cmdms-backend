import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Department } from '../../departments/entities/department.entity';
import { KpiFrequency } from '../../../common/enums';
import type { KpiData } from './kpi-data.entity';

@Entity('kpis')
export class Kpi extends AuditableEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'department_id' })
  departmentId: number;

  @Column({ type: 'enum', enum: KpiFrequency, default: KpiFrequency.MONTHLY })
  frequency: KpiFrequency;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  target: number;

  @Column({ nullable: true })
  unit: string; // e.g., 'percentage', 'count', 'amount'

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @OneToMany('KpiData', 'kpi')
  data: KpiData[];
}

