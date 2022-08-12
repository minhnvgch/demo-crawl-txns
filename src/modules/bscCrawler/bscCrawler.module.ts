import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LatestBlockBSCRepository } from 'src/models/repositories/bsc-lastest-block.repository';
import { BscCrawlerConsole } from 'src/modules/bscCrawler/bscCrawler.console';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [LatestBlockBSCRepository],
      'master',
    ),
    TypeOrmModule.forFeature(
      [LatestBlockBSCRepository],
      'report',
    ),
  ],
  controllers: [],
  providers: [BscCrawlerConsole],
})
export class BscCrawlerModule {}
