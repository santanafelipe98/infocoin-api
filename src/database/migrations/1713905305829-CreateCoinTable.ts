import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class CreateCoinTable1713905305829 implements MigrationInterface {
    private readonly coinTable: Table = new Table({
        name: "coins",
        columns: [
            new TableColumn({
                name: "id",
                type: "varchar",
                isGenerated: false,
                isPrimary: true
            }),
            new TableColumn({
                name: "symbol",
                type: "varchar"
            }),
            new TableColumn({
                name: "name",
                type: "varchar"
            })
        ]
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.coinTable);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.coinTable);
    }

}
