import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAlertConditionTables1714244194450 implements MigrationInterface {
    name = 'UpdateAlertConditionTables1714244194450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alerts" DROP CONSTRAINT "FK_4d67f2ea49bbf1d39aa0247a796"`);
        await queryRunner.query(`ALTER TABLE "alerts" DROP CONSTRAINT "REL_4d67f2ea49bbf1d39aa0247a79"`);
        await queryRunner.query(`ALTER TABLE "alerts" DROP COLUMN "where_condition"`);
        await queryRunner.query(`ALTER TABLE "conditions" ADD "alert_id" integer`);
        await queryRunner.query(`ALTER TABLE "conditions" ADD CONSTRAINT "UQ_9e50d7daad448db90748f960088" UNIQUE ("alert_id")`);
        await queryRunner.query(`ALTER TABLE "conditions" ADD CONSTRAINT "FK_9e50d7daad448db90748f960088" FOREIGN KEY ("alert_id") REFERENCES "alerts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conditions" DROP CONSTRAINT "FK_9e50d7daad448db90748f960088"`);
        await queryRunner.query(`ALTER TABLE "conditions" DROP CONSTRAINT "UQ_9e50d7daad448db90748f960088"`);
        await queryRunner.query(`ALTER TABLE "conditions" DROP COLUMN "alert_id"`);
        await queryRunner.query(`ALTER TABLE "alerts" ADD "where_condition" integer`);
        await queryRunner.query(`ALTER TABLE "alerts" ADD CONSTRAINT "REL_4d67f2ea49bbf1d39aa0247a79" UNIQUE ("where_condition")`);
        await queryRunner.query(`ALTER TABLE "alerts" ADD CONSTRAINT "FK_4d67f2ea49bbf1d39aa0247a796" FOREIGN KEY ("where_condition") REFERENCES "conditions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
