import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Department } from '../../departments/entities/department.entity';
import { User } from '../../users/entities/user.entity';

@Entity('letters')
export class Letter extends AuditableEntity {
  @Column({ name: 'letter_number' })
  letterNumber: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'date', name: 'letter_date' })
  letterDate: Date;

  @Column({ name: 'from_department_id', nullable: true })
  fromDepartmentId: number;

  @Column({ name: 'to_department_id', nullable: true })
  toDepartmentId: number;

  @Column({ name: 'reference_type', nullable: true })
  referenceType: string; // minute, directive, task, etc.

  @Column({ name: 'reference_id', nullable: true })
  referenceId: number;

  @Column()
  type: string; // official, notice, circular, memo

  @Column({ default: 'draft' })
  status: string; // draft, sent, received, archived

  @Column({ name: 'generated_by', nullable: true })
  generatedBy: number;

  @Column({ type: 'text', nullable: true, name: 'file_path' })
  filePath: string;

  // Relations
  @ManyToOne(() => Department)
  @JoinColumn({ name: 'from_department_id' })
  fromDepartment: Department;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'to_department_id' })
  toDepartment: Department;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'generated_by' })
  generator: User;
}

