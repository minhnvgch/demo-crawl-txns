import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class latestBlock1659349633020 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'latest_block',
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
            name: 'key',
            type: 'enum',
            enum: ['crawl_erc_1155', 'crawl_erc_721'],
            isNullable: false,
          },
          {
            name: 'block',
            type: 'int',
          },
          {
            name: 'block_per_process',
            type: 'int',
          },
          {
            name: 'num_process_scaling',
            type: 'int',
          },
          {
            name: 'sleep_time',
            type: 'int',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('latest_block');
  }
}
