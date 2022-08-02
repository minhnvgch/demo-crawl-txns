import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobConsole } from 'src/modules/job/job.console';
import { ChainRepository } from 'src/models/repositories/chain.repository';
import { LatestBlockRepository } from 'src/models/repositories/latest-block.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ChainRepository, LatestBlockRepository],
      'master',
    ),
    TypeOrmModule.forFeature(
      [ChainRepository, LatestBlockRepository],
      'report',
    ),
  ],
  controllers: [],
  providers: [JobConsole],
})
export class JobModule {}
