import { EntityRepository, Repository } from 'typeorm';
import { LatestBlockBSCEntity } from 'src/models/entities/bsc-lastest-block.entity';
import {IBlockNumber} from "src/modules/bscCrawler/bscCrawler.interface";


@EntityRepository(LatestBlockBSCEntity)
export class LatestBlockBSCRepository extends Repository<LatestBlockBSCEntity> {
    async getCurrentLatestBlock() : Promise<number> {
        const latestBlock = await this.findOne({
            order:{
                blockNumber: 'DESC'
            }
        });
        return (latestBlock == null) ? null : latestBlock.blockNumber;
    }

    // Todo: Change function name
    async createNewLatestBlock(block: IBlockNumber): Promise<LatestBlockBSCEntity>{
        const existBlock = await this.findOne({
            where: {
                blockNumber: block.number
            }
        });

        if(existBlock) return null;

        const newBlock = new LatestBlockBSCEntity();
        newBlock.blockHash = block.hash;
        newBlock.blockNumber = block.number;
        newBlock.blockSize = block.size;
        newBlock.miner = block.miner;
        newBlock.numberOfTransactions = block.transactions.length;
        return await this.save(newBlock);
    }

}
