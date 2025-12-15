import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Directive } from './directive.entity';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';
import { DecisionStatus } from '../../../common/enums';

@Entity('directive_responses')
export class DirectiveResponse extends BaseEntity {
  @Column({ name: 'directive_id' })
  directiveId: number;

  @Column({ name: 'department_id' })
  departmentId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'text' })
  response: string;

  @Column({ type: 'int', nullable: true })
  status: DecisionStatus;

  @Column({ type: 'date', nullable: true, name: 'requested_deadline' })
  requestedDeadline: Date;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  // Relations
  @ManyToOne(() => Directive, (directive) => directive.responses)
  @JoinColumn({ name: 'directive_id' })
  directive: Directive;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

