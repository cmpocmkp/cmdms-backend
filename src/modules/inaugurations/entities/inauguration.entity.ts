import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { District } from '../../departments/entities/district.entity';
import { Department } from '../../departments/entities/department.entity';

@Entity('inaugurations')
export class Inauguration extends AuditableEntity {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  location: string;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ name: 'department_id', nullable: true })
  departmentId: number;

  @Column()
  type: string; // inauguration, ground_breaking

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'project_cost' })
  projectCost: number;

  @Column({ type: 'json', nullable: true })
  attendees: string[];

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  // Relations
  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district: District;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;
}

