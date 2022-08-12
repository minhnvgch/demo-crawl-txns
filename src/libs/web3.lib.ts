const Web3 = require("web3");
import * as config from 'config';

export class Web3Client {
    private web3;
    constructor(){
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.get<string>('bsc_rpcs')));
    }

    async getBlock(blockNumber: number): Promise<any>{
        return await this.web3.eth.getBlock(blockNumber);
    }

    async getLatestBlock():Promise<number> {
        return await this.web3.eth.getBlockNumber();
    }
}

