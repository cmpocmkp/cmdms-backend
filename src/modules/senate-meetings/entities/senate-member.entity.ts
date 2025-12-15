import { Entity, Column } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { SenateMemberType } from '../../../common/enums';

@Entity('senate_members')
export class SenateMember extends AuditableEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  cnic: string;

  @Column()
  designation: string;

  @Column({ name: 'university_name' })
  universityName: string;

  @Column({ type: 'enum', enum: SenateMemberType })
  type: SenateMemberType;

  @Column({ nullable: true })
  faculty: string;

  @Column({ type: 'date', name: 'appointment_date' })
  appointmentDate: Date;

  @Column({ type: 'date', name: 'end_date', nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  contact: string;

  @Column({ nullable: true })
  specialization: string;
}

