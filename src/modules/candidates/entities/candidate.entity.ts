import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AuditableEntity } from '../../../common/entities/base.entity';
import { Constituency } from './constituency.entity';

@Entity('candidates')
export class Candidate extends AuditableEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  cnic: string;

  @Column()
  type: string; // MNA, MPA

  @Column({ name: 'constituency_id', nullable: true })
  constituencyId: number;

  @Column({ nullable: true })
  party: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Constituency)
  @JoinColumn({ name: 'constituency_id' })
  constituency: Constituency;
}

