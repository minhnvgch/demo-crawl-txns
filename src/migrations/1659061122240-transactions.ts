import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class transactions1659061122240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'transactions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'chain_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'contract_address',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'tx_hash',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'nft_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'from_address',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'to_address',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'block_number',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'block_time',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );
    await queryRunner.createIndex(
      'transactions',
      new TableIndex({
        name: 'IDX_transactions_1',
        columnNames: ['chain_id'],
      }),
    );
    await queryRunner.createIndex(
      'transactions',
      new TableIndex({
        name: 'IDX_transactions_2',
        columnNames: ['contract_address', 'nft_id', 'from_address'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
  }
}
