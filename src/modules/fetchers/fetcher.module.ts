import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChainRepository } from 'src/models/repositories/chain.repository';
import { LatestBlockRepository } from 'src/models/repositories/latest-block.repository';
import { Erc721CrawlerService } from 'src/modules/fetchers/erc721-crawler.service';

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
  providers: [Erc721CrawlerService],
})
export class FetcherModule {}
