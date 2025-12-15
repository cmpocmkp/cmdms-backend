import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { District } from '../../departments/entities/district.entity';

@Entity('public_days')
export class PublicDay extends AuditableEntity {
  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  location: string;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ type: 'int', default: 0, name: 'total_applications' })
  totalApplications: number;

  @Column({ type: 'int', default: 0, name: 'resolved_count' })
  resolvedCount: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  // Relations
  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district: District;
}

