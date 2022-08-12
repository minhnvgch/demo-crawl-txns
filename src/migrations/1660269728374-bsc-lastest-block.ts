import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class bscLastestBlock1660269728374 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: 'latest_block_bsc',
              columns: [
                {
                  name: 'id',
                  type: 'int',
                  isPrimary: true,
                  isGenerated: true,
                  generationStrategy: 'increment',
                },
                {
                    name: 'block_number',
                    type: 'int',
                    isNullable: false,
                    isUnique: true,
                },
                {
                    name: 'block_size',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'number_of_transactions',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'block_hash',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'miner',
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('latest_block_bsc');
    }

}
