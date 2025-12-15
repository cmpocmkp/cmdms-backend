import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Province } from './province.entity';

@Entity('districts')
export class District extends BaseEntity {
  @Column()
  name: string;

  @Column({ name: 'province_id' })
  provinceId: number;

  @ManyToOne(() => Province, (province) => province.districts)
  @JoinColumn({ name: 'province_id' })
  province: Province;
}

