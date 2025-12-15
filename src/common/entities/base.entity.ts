import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export abstract class AuditableEntity extends BaseEntity {
  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'modified_by', nullable: true })
  modifiedBy: number;
}

