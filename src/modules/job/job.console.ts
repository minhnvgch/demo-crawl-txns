import { Command, Console } from 'nestjs-console';
import { Injectable } from '@nestjs/common';
import { DoneCallback, Job } from 'bull';
import * as Queue from 'bull';
import Web3 from 'web3';
import { InjectRepository } from '@nestjs/typeorm';

import { getWeb3ProviderLink, sleep } from 'src/shares/utils';
import { IJobProvider, IQueuePayload } from 'src/modules/job/interfaces';
import {
  LatestBlockKey,
  mustValidBlockKey,
} from 'src/models/entities/latest-block.entity';
import { ChainRepository } from 'src/models/repositories/chain.repository';
import { LatestBlockRepository } from 'src/models/repositories/latest-block.repository';
import { BullLib } from 'src/libs/bull.lib';

@Console()
@Injectable()
export class JobConsole {
  private queue: Queue.Queue;

  constructor(
    @InjectRepository(ChainRepository, 'master')
    private readonly chainRepository: ChainRepository,
    @InjectRepository(LatestBlockRepository, 'master')
    private readonly latestBlockRepository: LatestBlockRepository,
  ) {}

  @Command({
    command: 'start-job-provider',
    description:
      'worker run start job provider [option]: -c <chain> -k <latestKey>',
    options: [
      { flags: '-c, --chain <chain>' },
      { flags: '-k, --key <latestKey>' },
    ],
  })
  async startJobProvider(option: IJobProvider): Promise<void> {
    const chainName = option.chain;
    const latestKey = option.latestKey as LatestBlockKey;

    const chain = await this.chainRepository.getChainByName(chainName, true);
    await mustValidBlockKey(latestKey);

    const queueName = `${chainName}_${latestKey}`;
    this.queue = await BullLib.createNewQueue(queueName);

    console.log(`Start pushing job to queue: ${queueName}`);

    const latestBlock = await this.latestBlockRepository.getLatestBlockByKey(
      latestKey,
      chain.id,
    );

    const cursor: number = latestBlock.block;
    const numBlockPerProcess: number = latestBlock.blockPerProcess;
    const sleepTime: number = latestBlock.sleepTime;
    const safeBlock = Number(process.env.SAFE_BLOCK);
    const rpc = await getWeb3ProviderLink(chain.id);
    const web3 = new Web3(new Web3.providers.HttpProvider(rpc));

    while (1) {
      const currentBlock = (await web3.eth.getBlockNumber()) - safeBlock;
      if (cursor >= currentBlock) {
        console.log(
          `Waiting new block created to continue create task for queue ${queueName}`,
        );
        await sleep(sleepTime);
        continue;
      }

      const fromBlock = cursor + 1;
      const toBlock = Math.min(cursor + numBlockPerProcess, currentBlock);
      const payload: IQueuePayload = {
        from: fromBlock,
        to: toBlock,
        chainId: chain.id,
      };

      await this.queue.add(payload, {
        jobId: `${fromBlock}_${toBlock}`,
        delay: 0,
        attempts: 5,
        removeOnComplete: true,
        removeOnFail: false,
      });
    }
  }

  @Command({
    command: 'exec-job',
    description: 'execute job [option]: -c <chain> -k <latestKey>',
    options: [
      { flags: '-c, --chain <chain>' },
      { flags: '-k, --key <latestKey>' },
    ],
  })
  async execJob(option: IJobProvider): Promise<void> {
    const chainName = option.chain;
    const latestKey = option.latestKey as LatestBlockKey;

    await this.chainRepository.getChainByName(chainName, true);
    await mustValidBlockKey(latestKey);

    const queueName = `${chainName}_${latestKey}`;
    this.queue = await BullLib.createNewQueue(queueName);

    await this.queue.process(this.handleJob.bind(this));
  }

  private handleJob(job: Job, done: DoneCallback) {
    try {
    } catch (error) {
      console.log('Error: crawlerWorkerQueueBull');
      console.error(error);
      done(new Error(error));
    }
  }
}
