import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CmRemarksController } from './cm-remarks.controller';
import { CmRemark } from './entities/cm-remark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CmRemark])],
  controllers: [CmRemarksController],
  exports: [TypeOrmModule],
})
export class CmRemarksModule {}

