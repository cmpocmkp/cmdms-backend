import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Department } from '../../departments/entities/department.entity';
import { DecisionStatus } from '../../../common/enums';

@Entity('cm_remarks')
export class CmRemark extends AuditableEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  remark: string;

  @Column({ type: 'date', name: 'remark_date' })
  remarkDate: Date;

  @Column({ type: 'date', nullable: true })
  timeline: Date;

  @Column({ type: 'int', default: DecisionStatus.ON_TARGET })
  status: DecisionStatus;

  @Column({ default: 'normal' })
  priority: string;

  @Column({ type: 'text', nullable: true })
  context: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  // Relations
  @ManyToMany(() => Department)
  @JoinTable({
    name: 'cm_remark_department',
    joinColumn: { name: 'cm_remark_id' },
    inverseJoinColumn: { name: 'department_id' },
  })
  departments: Department[];

  @OneToMany('CMRemarkResponse', 'cmRemark')
  responses: any[];
}

