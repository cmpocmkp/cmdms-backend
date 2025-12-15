import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { District } from '../../departments/entities/district.entity';
import type { AnnouncementDetail } from './announcement-detail.entity';

@Entity('announcements')
export class Announcement extends AuditableEntity {
  @Column()
  title: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  type: string; // press_release, policy, event, public, emergency

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'normal' })
  priority: string; // low, normal, high, urgent

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  // Relations
  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district: District;

  @OneToMany('AnnouncementDetail', 'announcement')
  details: AnnouncementDetail[];
}

