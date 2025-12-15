import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('department_types')
export class DepartmentType extends BaseEntity {
  @Column()
  name: string; // RecordNote, Board, Sectorial, DC, etc.
}

