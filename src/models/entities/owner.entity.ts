import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('owners')
export class Owner {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'contract_address', type: 'varchar', nullable: false })
  public contractAddress: string;

  @Column({ name: 'nft_id', type: 'int', nullable: false })
  public nftId: number;

  @Column({ name: 'owner_address', type: 'varchar', nullable: false })
  public ownerAddress: string;

  @Column({ name: 'value', type: 'int', nullable: false })
  public value: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;
}
