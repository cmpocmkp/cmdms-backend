import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Minute } from './minute.entity';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';

@Entity('replies')
export class Reply extends BaseEntity {
  @Column({ name: 'minute_id' })
  minuteId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'department_id' })
  departmentId: number;

  @Column({ type: 'text' })
  response: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  // Relations
  @ManyToOne(() => Minute, (minute) => minute.replies)
  @JoinColumn({ name: 'minute_id' })
  minute: Minute;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;
}

