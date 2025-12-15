import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('activity_logs')
export class ActivityLog extends BaseEntity {
  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'log_name', nullable: true })
  logName: string; // e.g., 'meeting', 'directive', 'user'

  @Column()
  description: string;

  @Column({ name: 'subject_type', nullable: true })
  subjectType: string; // Model name: 'Meeting', 'Directive', etc.

  @Column({ name: 'subject_id', nullable: true })
  subjectId: number;

  @Column({ name: 'causer_type', nullable: true })
  causerType: string; // Usually 'User'

  @Column({ name: 'causer_id', nullable: true })
  causerId: number;

  @Column({ type: 'json', nullable: true })
  properties: any; // Old and new values

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'causer_id' })
  causer: User;
}

