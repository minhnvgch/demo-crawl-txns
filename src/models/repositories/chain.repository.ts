import { EntityRepository, Repository } from 'typeorm';
import { Chain, ChainError } from 'src/models/entities/chain.entity';

@EntityRepository(Chain)
export class ChainRepository extends Repository<Chain> {
  async getChainByName(name: string, isMustValid = false): Promise<Chain> {
    const chain = await this.findOne({
      where: {
        name,
      },
    });

    if (!chain && !isMustValid) throw Error(ChainError.InvalidChainName);
    return chain;
  }

  async getChainById(id: number): Promise<Chain> {
    return this.findOne({
      where: {
        id,
      },
    });
  }
}
