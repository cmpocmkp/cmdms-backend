import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { District } from './district.entity';

@Entity('provinces')
export class Province extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => District, (district) => district.province)
  districts: District[];
}

