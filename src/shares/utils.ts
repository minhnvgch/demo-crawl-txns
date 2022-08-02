import { ChainRepository } from 'src/models/repositories/chain.repository';

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getWeb3ProviderLink = async (chainId: number): Promise<string> => {
  const chainRepository = new ChainRepository();
  const DELIMITER_CHAR: string = ',';
  const chain = await chainRepository.getChainById(chainId);
  const WEB3_API_URLS = chain.rpcs.split(DELIMITER_CHAR);
  const currentMinutes = new Date().getMinutes();
  return WEB3_API_URLS[
    Math.floor(currentMinutes / (60 / WEB3_API_URLS.length))
  ];
};
