import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Console } from "nestjs-console";
import { Command } from "nestjs-console";
import { LatestBlockBSCRepository } from "src/models/repositories/bsc-lastest-block.repository";
import { sleep } from 'src/shares/utils';
import { Web3Client } from 'src/libs/web3.lib';

@Console()
@Injectable()
export class BscCrawlerConsole{
    private web3Client;

    constructor(
        @InjectRepository(LatestBlockBSCRepository, 'master')
        private readonly latestBlockBSCRepository: LatestBlockBSCRepository,
    ) {
        this.web3Client = new Web3Client();
    }

    async initializeBlock(latestBlock: number): Promise<void> {
        const currentBlockInfo = await this.web3Client.getBlock(latestBlock);
        await this.latestBlockBSCRepository.createNewLatestBlock(currentBlockInfo);
    }

    @Command({
        command: 'crawl',
        description: 'Test'
    })
    async testWeb3(): Promise<void>{
        let latestBlockNumber = await this.web3Client.getLatestBlock();

        const existBlockNumber = await this.latestBlockBSCRepository.getCurrentLatestBlock()
        if (!existBlockNumber) await this.initializeBlock(latestBlockNumber);
        const latestBlock = await this.latestBlockBSCRepository.getCurrentLatestBlock();

        let currentBlockNumber = latestBlock + 1;

        while(1) {
            latestBlockNumber = await this.web3Client.getLatestBlock();

            if (latestBlockNumber < currentBlockNumber) {
                console.log('Waiting for next block created');
                await sleep(3000);
                continue;
            }

            const currentBlockInfo = await this.web3Client.getBlock(currentBlockNumber);
            await this.latestBlockBSCRepository.createNewLatestBlock(currentBlockInfo);
            currentBlockNumber += 1;
        }
    }
}