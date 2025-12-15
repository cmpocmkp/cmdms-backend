import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Complaint } from './complaint.entity';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';

@Entity('complaint_responses')
export class ComplaintResponse extends BaseEntity {
  @Column({ name: 'complaint_id' })
  complaintId: number;

  @Column({ name: 'department_id' })
  departmentId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'text' })
  response: string;

  @Column({ type: 'text', nullable: true, name: 'action_taken' })
  actionTaken: string;

  @Column({ type: 'text', nullable: true, name: 'resolution_details' })
  resolutionDetails: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  // Relations
  @ManyToOne(() => Complaint, (complaint) => complaint.responses)
  @JoinColumn({ name: 'complaint_id' })
  complaint: Complaint;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

