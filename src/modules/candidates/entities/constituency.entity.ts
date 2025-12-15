import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { District } from '../../departments/entities/district.entity';
import type { Candidate } from './candidate.entity';

@Entity('constituencies')
export class Constituency extends BaseEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  type: string; // National, Provincial

  @Column({ name: 'district_id', nullable: true })
  districtId: number;

  // Relations
  @ManyToOne(() => District)
  @JoinColumn({ name: 'district_id' })
  district: District;

  @OneToMany('Candidate', 'constituency')
  candidates: Candidate[];
}

