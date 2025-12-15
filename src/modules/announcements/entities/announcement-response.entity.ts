import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AnnouncementDetail } from './announcement-detail.entity';
import { Department } from '../../departments/entities/department.entity';
import { User } from '../../users/entities/user.entity';
import { DecisionStatus } from '../../../common/enums';

@Entity('announcement_responses')
export class AnnouncementResponse extends BaseEntity {
  @Column({ name: 'announcement_detail_id' })
  announcementDetailId: number;

  @Column({ name: 'department_id' })
  departmentId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'text' })
  response: string;

  @Column({ type: 'int', nullable: true })
  status: DecisionStatus;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  // Relations
  @ManyToOne(() => AnnouncementDetail, (detail) => detail.responses)
  @JoinColumn({ name: 'announcement_detail_id' })
  announcementDetail: AnnouncementDetail;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

