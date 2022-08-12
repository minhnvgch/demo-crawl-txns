import { EntityRepository, Repository } from 'typeorm';
import { LatestBlockBSCEntity } from 'src/models/entities/bsc-lastest-block.entity';


@EntityRepository(LatestBlockBSCEntity)
export class LatestBlockBSCRepository extends Repository<LatestBlockBSCEntity> {
    async getCurrentLatestBlock() : Promise<number> {
        const latestBlock = await this.findOne({
            order:{
                blockNumber: 'DESC'
            }
        });
        if(latestBlock == null){
            return null;
        }else{
            return latestBlock.blockNumber;
        }
    }

    async createNewLatestBlock(block): Promise<LatestBlockBSCEntity>{
        const existBlock = await this.findOne({
            where:{
                blockNumber:block.number
            }
        });
        if(existBlock){
            return null;
        }
        const addBlock = new LatestBlockBSCEntity();
        addBlock.blockHash = block.hash;
        addBlock.blockNumber = block.number;
        addBlock.blockSize = block.size;
        addBlock.miner = block.miner;
        addBlock.numberOfTransactions = block.transactions.length;
        console.log("Create new Block: ");
        console.log(addBlock);
        return await this.save(addBlock);
    }

}
