import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Department } from '../../departments/entities/department.entity';
import { District } from '../../departments/entities/district.entity';
import type { ComplaintResponse } from './complaint-response.entity';

@Entity('complaints')
export class Complaint extends AuditableEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  detail: string;

  @Column({ name: 'applicant_name' })
  applicantName: string;

  @Column({ name: 'applicant_contact', nullable: true })
  applicantContact: string;

  @Column({ name: 'applicant_cnic', nullable: true })
  applicantCnic: string;

  @Column({ nullable: true })
  location: string;

  @Column({ name: 'department_id' })
  departmentId: number;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ name: 'diary_number', nullable: true })
  diaryNumber: string;

  @Column({ type: 'date' })
  timeline: Date;

  @Column({ default: 'new' })
  status: string; // new, in_progress, resolved, closed, reopened

  @Column({ default: 'normal' })
  priority: string; // low, normal, high, urgent

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  @Column({ type: 'int', nullable: true, name: 'satisfaction_rating' })
  satisfactionRating: number; // 1-5 stars

  @Column({ type: 'text', nullable: true, name: 'citizen_feedback' })
  citizenFeedback: string;

  // Relations
  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district: District;

  @OneToMany('ComplaintResponse', 'complaint')
  responses: ComplaintResponse[];
}

