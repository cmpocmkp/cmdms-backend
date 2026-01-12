import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CMRemarksService } from './cm-remarks.service';
import { CmRemarksController } from './cm-remarks.controller';
import { CmRemark } from './entities/cm-remark.entity';
import { CMRemarkResponse } from './entities/cm-remark-response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CmRemark, CMRemarkResponse])],
  controllers: [CmRemarksController],
  providers: [CMRemarksService],
  exports: [CMRemarksService, TypeOrmModule],
})
export class CmRemarksModule { }

