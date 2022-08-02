export interface IJobProvider {
  chain: string;
  latestKey: string;
}

export interface IQueuePayload {
  from: number;
  to: number;
  chainId: number;
}
