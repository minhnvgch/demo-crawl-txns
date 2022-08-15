import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('latest_block')
export class LatestBlockEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'chain_id', type: 'int', nullable: false })
  public chainId: number;

  @Column({ name: 'key', nullable: false, unique: true })
  public key: LatestBlockKey | string;

  @Column({ name: 'block', nullable: false })
  public block: number;

  @Column({ name: 'block_per_process', nullable: false })
  public blockPerProcess: number;

  @Column({ name: 'num_process_scaling', nullable: false })
  public numProcessScaling: number;

  @Column({ name: 'sleep_time', nullable: false })
  public sleepTime: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;
}

export enum LatestBlockKey {
  CrawlErc1155 = 'crawl_erc_1155',
  CrawlErc721 = 'crawl_erc_721',
}

export const mustValidBlockKey = async (
  latestKey: LatestBlockKey,
): Promise<void> => {
  if (!Object.values(LatestBlockKey).includes(latestKey))
    throw Error('Invalid latest block key');
};
