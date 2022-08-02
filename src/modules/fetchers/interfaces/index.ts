import { Log } from 'web3-core';

export interface IWeb3Log extends Log {
  blockTime: number;
  topic: TopicLog;
}

export enum TopicLog {
  ERC721_TRANSFER_SINGLE = '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62',
  ERC721_TRANSFER_BATCH = '0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb',
}

export enum FetchError {
  InvalidTopic = 'Invalid topic handle',
}
