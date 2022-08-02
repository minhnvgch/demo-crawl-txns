import { EntityRepository, Repository } from 'typeorm';
import {
  LatestBlockEntity,
  LatestBlockKey,
} from 'src/models/entities/latest-block.entity';

@EntityRepository(LatestBlockEntity)
export class LatestBlockRepository extends Repository<LatestBlockEntity> {
  constructor() {
    super();
  }

  public async getLatestBlockByKey(
    key: LatestBlockKey,
    chainId: number,
  ): Promise<LatestBlockEntity> {
    const latestBlock = this.findOne({
      where: {
        key,
        chainId,
      },
    });
    if (!latestBlock) return this.createLatestBlockByKey(key, chainId);
    return latestBlock;
  }

  private async createLatestBlockByKey(
    key: string,
    chainId: number,
    block = 0,
    numBlockPerProcess = 100,
    numProcess = 10,
    sleepTime = 100,
  ): Promise<LatestBlockEntity> {
    const newLatestBlock = new LatestBlockEntity();
    newLatestBlock.key = key;
    newLatestBlock.chainId = chainId;
    newLatestBlock.block = block;
    newLatestBlock.blockPerProcess = numBlockPerProcess;
    newLatestBlock.numProcessScaling = numProcess;
    newLatestBlock.sleepTime = sleepTime;
    return await this.save(newLatestBlock);
  }
}
