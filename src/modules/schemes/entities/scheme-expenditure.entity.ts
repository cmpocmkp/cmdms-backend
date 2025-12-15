import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AnnualScheme } from './annual-scheme.entity';

@Entity('scheme_expenditures')
export class SchemeExpenditure extends BaseEntity {
  @Column({ name: 'annual_scheme_id' })
  annualSchemeId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column()
  purpose: string;

  @Column({ name: 'financial_year' })
  financialYear: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  // Relations
  @ManyToOne(() => AnnualScheme, (scheme) => scheme.expenditures)
  @JoinColumn({ name: 'annual_scheme_id' })
  scheme: AnnualScheme;
}

