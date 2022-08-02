import * as Queue from 'bull';
import { redisConfig } from 'src/configs/redis';

export class BullLib {
  static async createNewQueue(queueName: string): Promise<Queue.Queue> {
    return new Queue(queueName, {
      redis: redisConfig,
    });
  }
}
