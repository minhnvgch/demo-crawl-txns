import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class owners1659063128387 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'owners',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'contract_address',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'nft_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'owner_address',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'int',
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
      'owners',
      new TableIndex({
        name: 'IDX_owners_1',
        columnNames: ['contract_address', 'nft_id', 'owner_address'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('owners');
  }
}
