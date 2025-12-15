import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidatesController } from './candidates.controller';
import { Candidate } from './entities/candidate.entity';
import { Constituency } from './entities/constituency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate, Constituency])],
  controllers: [CandidatesController],
  exports: [TypeOrmModule],
})
export class CandidatesModule {}

