import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AnnualScheme } from './annual-scheme.entity';

@Entity('scheme_budgets')
export class SchemeBudget extends BaseEntity {
  @Column({ name: 'annual_scheme_id' })
  annualSchemeId: number;

  @Column({ name: 'financial_year' })
  financialYear: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'date', nullable: true, name: 'release_date' })
  releaseDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'actual_release' })
  actualRelease: number;

  // Relations
  @ManyToOne(() => AnnualScheme, (scheme) => scheme.budgets)
  @JoinColumn({ name: 'annual_scheme_id' })
  scheme: AnnualScheme;
}

