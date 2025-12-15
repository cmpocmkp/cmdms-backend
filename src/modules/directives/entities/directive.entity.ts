import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Department } from '../../departments/entities/department.entity';
import { DecisionStatus } from '../../../common/enums';
import type { DirectiveResponse } from './directive-response.entity';

@Entity('directives')
export class Directive extends AuditableEntity {
  @Column({ name: 'letter_number' })
  letterNumber: string;

  @Column()
  subject: string;

  @Column({ type: 'date', name: 'issue_date' })
  issueDate: Date;

  @Column({ type: 'date' })
  timeline: Date;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @Column({ type: 'int', default: DecisionStatus.ON_TARGET })
  status: DecisionStatus;

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  // Relations
  @ManyToMany(() => Department)
  @JoinTable({
    name: 'department_directive',
    joinColumn: { name: 'directive_id' },
    inverseJoinColumn: { name: 'department_id' },
  })
  departments: Department[];

  @OneToMany('DirectiveResponse', 'directive')
  responses: DirectiveResponse[];
}

