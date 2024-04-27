import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCoinForeignKeyToAlertTable1714245746923 implements MigrationInterface {
    name = 'AddCoinForeignKeyToAlertTable1714245746923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alerts" ADD "coin_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "alerts" ADD CONSTRAINT "FK_0cdab8adc2b06e20b2e52054e7e" FOREIGN KEY ("coin_id") REFERENCES "coins"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alerts" DROP CONSTRAINT "FK_0cdab8adc2b06e20b2e52054e7e"`);
        await queryRunner.query(`ALTER TABLE "alerts" DROP COLUMN "coin_id"`);
    }

}
