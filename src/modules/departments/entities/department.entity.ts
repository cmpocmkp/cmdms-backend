import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { DepartmentType } from './department-type.entity';
import { District } from './district.entity';

@Entity('departments')
export class Department extends AuditableEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'department_type_id' })
  departmentTypeId: number;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ default: true })
  active: boolean;

  // Relations
  @ManyToOne(() => DepartmentType)
  @JoinColumn({ name: 'department_type_id' })
  departmentType: DepartmentType;

  @ManyToOne(() => Department, (dept) => dept.children)
  @JoinColumn({ name: 'parent_id' })
  parent: Department;

  @OneToMany(() => Department, (dept) => dept.parent)
  children: Department[];

  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district: District;
}

