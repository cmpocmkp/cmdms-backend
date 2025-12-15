import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Kpi } from './kpi.entity';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';
import { District } from '../../departments/entities/district.entity';

@Entity('kpi_data')
export class KpiData extends BaseEntity {
  @Column({ name: 'kpi_id' })
  kpiId: number;

  @Column({ name: 'department_id' })
  departmentId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  // Relations
  @ManyToOne(() => Kpi, (kpi) => kpi.data)
  @JoinColumn({ name: 'kpi_id' })
  kpi: Kpi;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district: District;
}

