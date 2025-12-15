import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AnnualScheme } from './annual-scheme.entity';

@Entity('scheme_revisions')
export class SchemeRevision extends BaseEntity {
  @Column({ name: 'annual_scheme_id' })
  annualSchemeId: number;

  @Column({ name: 'revision_number' })
  revisionNumber: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true, name: 'revised_cost' })
  revisedCost: number;

  @Column({ type: 'date', nullable: true, name: 'revised_timeline' })
  revisedTimeline: Date;

  @Column({ type: 'text', nullable: true, name: 'scope_changes' })
  scopeChanges: string;

  // Relations
  @ManyToOne(() => AnnualScheme, (scheme) => scheme.revisions)
  @JoinColumn({ name: 'annual_scheme_id' })
  scheme: AnnualScheme;
}

