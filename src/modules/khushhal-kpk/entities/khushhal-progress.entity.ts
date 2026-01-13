import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { KhushhalTask } from './khushhal-task.entity';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';
import { KhushhalProgressStatus, KhushhalProgressType } from '../../../common/enums';

@Entity('khushhal_progress')
export class KhushhalProgress extends BaseEntity {
  @Column({ name: 'khushhal_task_id' })
  khushhalTaskId: number;

  @Column({ name: 'department_id', nullable: true })
  departmentId: number;

  @Column({ type: 'date', nullable: true })
  date: Date;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: KhushhalProgressType, default: KhushhalProgressType.NARRATIVE })
  type: KhushhalProgressType;

  @Column({ type: 'enum', enum: KhushhalProgressStatus, nullable: true })
  status: KhushhalProgressStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  metrics: number;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @Column({ name: 'uploaded_by', nullable: true })
  uploadedBy: number;

  // Relations
  @ManyToOne(() => KhushhalTask, (task) => task.progress)
  @JoinColumn({ name: 'khushhal_task_id' })
  khushhalTask: KhushhalTask;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by' })
  uploader: User;
}
