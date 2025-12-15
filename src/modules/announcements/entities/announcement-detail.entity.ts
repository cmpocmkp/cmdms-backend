import { Entity, Column, ManyToOne, ManyToMany, JoinTable, JoinColumn, OneToMany } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Announcement } from './announcement.entity';
import { Department } from '../../departments/entities/department.entity';
import { DecisionStatus } from '../../../common/enums';
import type { AnnouncementResponse } from './announcement-response.entity';

@Entity('announcement_details')
export class AnnouncementDetail extends AuditableEntity {
  @Column({ name: 'announcement_id' })
  announcementId: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date' })
  timeline: Date;

  @Column({ type: 'int', default: DecisionStatus.ON_TARGET })
  status: DecisionStatus;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @Column({ name: 'main_department_id', nullable: true })
  mainDepartmentId: number;

  // Relations
  @ManyToOne(() => Announcement, (announcement) => announcement.details)
  @JoinColumn({ name: 'announcement_id' })
  announcement: Announcement;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'main_department_id' })
  mainDepartment: Department;

  @ManyToMany(() => Department)
  @JoinTable({
    name: 'announcement_detail_department',
    joinColumn: { name: 'announcement_detail_id' },
    inverseJoinColumn: { name: 'department_id' },
  })
  otherDepartments: Department[];

  @OneToMany('AnnouncementResponse', 'announcementDetail')
  responses: AnnouncementResponse[];
}

