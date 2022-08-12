import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Console } from "nestjs-console";
import { Command } from "nestjs-console";
import { LatestBlockBSCRepository } from "src/models/repositories/bsc-lastest-block.repository";
import { sleep } from '../../shares/utils';
import { Web3Client } from '../../libs/web3.lib';

@Console()
@Injectable()
export class BscCrawlerConsole{

    constructor(
        @InjectRepository(LatestBlockBSCRepository, 'master')
        private readonly latestBlockBSCRepository: LatestBlockBSCRepository,
      ) {}

    @Command({
        command: 'crawl',
        description: 'Test'
    })
    async testWeb3(): Promise<void>{
        const web3Client = new Web3Client();
        let latestBlockNumber = await web3Client.getLatestBlock();
        // const latestBlockInformation = await web3Client.getBlock(latestBlockNumber);
        
        const existBlockNumber = await this.latestBlockBSCRepository.getCurrentLatestBlock()
        if(existBlockNumber==null){
            let currentBlockNumber = latestBlockNumber;
            while(true){
                const currentBlockInfo = await web3Client.getBlock(currentBlockNumber);
                if(currentBlockInfo==null){
                    currentBlockNumber = await this.latestBlockBSCRepository.getCurrentLatestBlock();
                }else{
                    this.latestBlockBSCRepository.createNewLatestBlock(currentBlockInfo);
                    currentBlockNumber += 1;
                }
            }    
        }
        else{
            let currentBlockNumber = existBlockNumber;
            while(currentBlockNumber<latestBlockNumber){
                latestBlockNumber = await web3Client.getLatestBlock();
                const currentBlockInfo = await web3Client.getBlock(currentBlockNumber);
                if(currentBlockInfo==null){
                    currentBlockNumber = await this.latestBlockBSCRepository.getCurrentLatestBlock();
                }else{
                    this.latestBlockBSCRepository.createNewLatestBlock(currentBlockInfo);
                    currentBlockNumber += 1;
                }
            }    
            console.log("Execute successfully past blocks");
            currentBlockNumber += 1;
            while(true){
                const currentBlockInfo = await web3Client.getBlock(currentBlockNumber);
                if(currentBlockInfo==null){
                    currentBlockNumber = await this.latestBlockBSCRepository.getCurrentLatestBlock();
                }else{
                    this.latestBlockBSCRepository.createNewLatestBlock(currentBlockInfo);
                    currentBlockNumber += 1;
                }
            }    
        }
    }
}