import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('meeting_types')
export class MeetingType extends BaseEntity {
  @Column()
  name: string; // Normal, Cabinet, PTF, PMRU, Board, Sectorial, Senate
}

