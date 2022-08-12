import {
    Entity,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity('latest_block_bsc')
  export class LatestBlockBSCEntity {
    @PrimaryGeneratedColumn()
    public id: number;
  
    @Column({ name: 'block_number', nullable: false, unique: true })
    public blockNumber: number;

    @Column({ name: 'block_size', nullable: false })
    public blockSize: number;
  
    @Column({ name: 'number_of_transactions', nullable: false })
    public numberOfTransactions: number;

    @Column({ name: 'miner', nullable: false })
    public miner: string;

    @Column({ name: 'block_hash', nullable: false, unique:true })
    public blockHash: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    public createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    public updatedAt: Date;
  }
  