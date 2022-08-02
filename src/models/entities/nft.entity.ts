import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum NftType {
  erc721 = 'ERC721',
  erc1155 = 'ERC1155',
}

@Entity('nfts')
export class Nft {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'chain_id', type: 'int', nullable: false })
  public chainId: number;

  @Column({ name: 'contract_address', type: 'varchar', nullable: false })
  public contractAddress: string;

  @Column({ name: 'nft_id', type: 'int', nullable: false })
  public nftId: number;

  @Column({
    name: 'type',
    type: 'enum',
    enum: ['ERC721', 'ERC1155'],
    nullable: false,
  })
  public type: NftType;

  @Column({ name: 'amount', type: 'varchar', nullable: true })
  public amount: string;

  @Column({ name: 'name', type: 'varchar', nullable: true })
  public name: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  public description: string;

  @Column({ name: 'image', type: 'varchar', nullable: true })
  public image: string;

  @Column({ name: 'external_url', type: 'varchar', nullable: true })
  public externalUrl: string;

  @Column({ name: 'attributes', type: 'varchar', nullable: true })
  public attributes: string;

  @Column({ name: 'ipfs_hash', type: 'varchar', nullable: true })
  public ipfsHash: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;
}
