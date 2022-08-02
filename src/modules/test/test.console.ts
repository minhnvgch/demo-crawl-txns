import { Injectable } from '@nestjs/common';
import { Console, Command } from 'nestjs-console';
import { DoneCallback, Job } from 'bull';
import * as Queue from 'bull';
import { redisConfig } from 'src/configs/redis';
import { sleep } from 'src/shares/utils';

@Console()
@Injectable()
export class TestConsole {
  private testQueue: Queue.Queue;

  constructor() {
    this.testQueue = new Queue('test', {
      redis: redisConfig,
    });
  }

  @Command({
    command: 'test',
    description: 'This is a test console',
  })
  async test(): Promise<void> {
    console.log('Test ok');
  }

  @Command({
    command: 'test-create-task',
    description: 'this is just a test bull queue',
  })
  async createTask(): Promise<void> {
    setInterval(async () => {
      await this.testQueue.add(
        { message: `Hi at ${new Date().toISOString()}` },
        {
          jobId: Date.now(),
          delay: 0,
          attempts: 5,
          removeOnComplete: false,
          removeOnFail: false,
        },
      );
      console.log({ message: `Hi at ${new Date().toISOString()}` });
    }, 2000);
  }

  @Command({
    command: 'test-process-task',
    description: 'this is just a test bull queue',
  })
  async processTask(): Promise<void> {
    while (1) {
      await this.testQueue.process(async (job: Job, done: DoneCallback) => {
        try {
          console.log(`\n=======================`);
          console.log(job.data);
          done();
          console.log('=======================');
          await sleep(2000);
        } catch (err) {
          console.error(err);
          done(new Error(err));
        }
      });
    }
  }
}
