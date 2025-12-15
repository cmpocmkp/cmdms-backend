import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AnnualScheme } from './annual-scheme.entity';

@Entity('scheme_costings')
export class SchemeCosting extends BaseEntity {
  @Column({ name: 'annual_scheme_id' })
  annualSchemeId: number;

  @Column()
  year: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'estimated_cost' })
  estimatedCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, name: 'actual_cost', nullable: true })
  actualCost: number;

  @Column({ type: 'text', nullable: true })
  breakdown: string;

  // Relations
  @ManyToOne(() => AnnualScheme, (scheme) => scheme.costings)
  @JoinColumn({ name: 'annual_scheme_id' })
  scheme: AnnualScheme;
}

