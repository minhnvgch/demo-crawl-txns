import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'chain_id', type: 'int', nullable: false })
  public chainId: number;

  @Column({ name: 'contract_address', type: 'varchar', nullable: false })
  public contractAddress: string;

  @Column({ name: 'tx_hash', type: 'varchar', nullable: false })
  public txHash: string;

  @Column({ name: 'nft_id', type: 'int', nullable: false })
  public nftId: string;

  @Column({ name: 'from_address', type: 'varchar', nullable: false })
  public fromAddress: string;

  @Column({ name: 'to_address', type: 'varchar', nullable: false })
  public toAddress: string;

  @Column({ name: 'value', type: 'int', nullable: false })
  public value: number;

  @Column({ name: 'block_number', type: 'int', nullable: false })
  public blockNumber: number;

  @Column({ name: 'block_time', type: 'bigint', nullable: false })
  public blockTime: number;

  @Column({ name: 'status', type: 'varchar', nullable: false })
  public status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;
}
