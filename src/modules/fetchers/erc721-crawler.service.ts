import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { Log } from 'web3-core';
import pLimit from 'p-limit';
import Web3 from 'web3';
import { getWeb3ProviderLink } from 'src/shares/utils';
import { TransactionEntity } from 'src/models/entities/transaction.entity';
import {
  FetchError,
  IWeb3Log,
  TopicLog,
} from 'src/modules/fetchers/interfaces';

const limit = pLimit(5);

@Injectable()
export class Erc721CrawlerService {
  private web3: Web3;
  constructor(readonly option: any) {
    this.initWeb3();
  }

  public getOption() {
    return this.option;
  }

  public async getBlockInfo(blockNumber: number): Promise<object> {
    return this.web3.eth.getBlock(blockNumber);
  }

  // crawl ERC721 logs transaction by 2 events: TransferSingle and TransferBatch
  public async processBlocks(fromBlock: number, toBlock: number) {
    console.log(
      `processBlocks BEGIN_PROCESS_BLOCKS: ${fromBlock} → ${toBlock}}`,
    );

    const [dataLogsSingle, dataLogsBatch] = await this.getPastLogs(
      fromBlock,
      toBlock,
    );
    const dataLogs = [...dataLogsSingle, ...dataLogsBatch];
    const blocksInfo = await this.getBlockTimeByBlockNumbers(dataLogs);
    const formatLogs: IWeb3Log[] = dataLogs.map((log: Log): IWeb3Log => {
      return {
        ...log,
        blockTime: blocksInfo[log.blockNumber] as unknown as number,
        topic: log.topics[0] as TopicLog,
      };
    });

    const txs: TransactionEntity[] = [];
    for (const log of formatLogs) {
      switch (log.topic) {
        case TopicLog.ERC721_TRANSFER_SINGLE:
          txs.push(this.handleTransferSingle(log));
          break;
        case TopicLog.ERC721_TRANSFER_BATCH:
          txs.push(...this.handleTransferBatch(log));
          break;
        default:
          throw Error(FetchError.InvalidTopic);
      }
    }
    await getConnection().transaction(async (entityManager) => {
      await entityManager.save(txs);
    });
  }

  public handleTransferSingle(dataLog: IWeb3Log): TransactionEntity {
    const decodedData = this.web3.eth.abi.decodeParameters(
      ['uint256', 'uint256'],
      dataLog.data,
    );
    const tx = new TransactionEntity();
    tx.chainId = this.getOption().chainId;
    tx.contractAddress = dataLog.address;
    tx.txHash = dataLog.transactionHash;
    tx.nftId = Object.values(decodedData)[0];
    tx.fromAddress = dataLog.topics[2];
    tx.toAddress = dataLog.topics[3];
    tx.value = Object.values(decodedData)[1];
    tx.blockNumber = dataLog.blockNumber;
    tx.blockTime = dataLog.blockTime;

    return tx;
  }

  public handleTransferBatch(dataLog: IWeb3Log): TransactionEntity[] {
    const decodedData = this.web3.eth.abi.decodeParameters(
      ['uint256[]', 'uint256[]'],
      dataLog.data,
    );
    return Object.values(decodedData)[0].map((nftId: string, index: number) => {
      const tx = new TransactionEntity();
      tx.chainId = this.getOption().chainId;
      tx.contractAddress = dataLog.address;
      tx.txHash = dataLog.transactionHash;
      tx.nftId = nftId;
      tx.fromAddress = dataLog.topics[2];
      tx.toAddress = dataLog.topics[3];
      tx.value = Object.values(decodedData)[1][index];
      tx.blockNumber = dataLog.blockNumber;
      tx.blockTime = dataLog.blockTime;
      return tx;
    });
  }

  private async initWeb3(): Promise<void> {
    const rpcUrl = await getWeb3ProviderLink(this.option.chainId);
    this.web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }

  private async getBlockTimeByBlockNumbers(
    eventLogs: Log[],
  ): Promise<object[]> {
    const blockNumbers = Array.from(
      new Set(eventLogs.map((log: Log) => log.blockNumber)),
    );
    const blockInfos = await Promise.all(
      blockNumbers.map(async (blockNumber: number) =>
        limit(() => this.getBlockInfo(blockNumber)),
      ),
    );
    return blockInfos.reduce((blockTimeByNumber: any, blockInfo: any) => {
      return {
        ...blockTimeByNumber,
        [blockInfo.number]: blockInfo.timestamp,
      };
    }, {});
  }

  private async getPastLogs(
    fromBlock: number,
    toBlock: number,
  ): Promise<Log[][]> {
    const [dataLogsSingle, dataLogsBatch] = await Promise.all([
      await this.web3.eth.getPastLogs({
        fromBlock,
        toBlock,
        topics: [TopicLog.ERC721_TRANSFER_SINGLE],
      }),
      await this.web3.eth.getPastLogs({
        fromBlock,
        toBlock,
        topics: [TopicLog.ERC721_TRANSFER_BATCH],
      }),
    ]);

    return [dataLogsSingle, dataLogsBatch];
  }
}
