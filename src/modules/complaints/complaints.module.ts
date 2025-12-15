import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { Complaint } from './entities/complaint.entity';
import { ComplaintResponse } from './entities/complaint-response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Complaint, ComplaintResponse])],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
  exports: [ComplaintsService, TypeOrmModule],
})
export class ComplaintsModule {}

