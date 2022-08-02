import { ConsoleModule } from 'nestjs-console';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TestModule } from 'src/modules/test/test.module';
import { JobModule } from 'src/modules/job/job.module';
import { redisConfig } from 'src/configs/redis';
import {
  defaultConfig,
  masterConfig,
  reportConfig,
} from 'src/configs/database';

@Module({
  imports: [
    BullModule.forRoot({
      redis: redisConfig,
      prefix: 'nft-crawler',
    }),
    TypeOrmModule.forRoot(defaultConfig),
    TypeOrmModule.forRoot(masterConfig),
    TypeOrmModule.forRoot(reportConfig),
    ConsoleModule,
    TestModule,
    JobModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
