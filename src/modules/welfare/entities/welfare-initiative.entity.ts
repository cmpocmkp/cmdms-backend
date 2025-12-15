import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { District } from '../../departments/entities/district.entity';

@Entity('welfare_initiatives')
export class WelfareInitiative extends AuditableEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'date', name: 'launch_date' })
  launchDate: Date;

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  budget: number;

  @Column({ type: 'int', default: 0 })
  beneficiaries: number;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  // Relations
  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district: District;
}

