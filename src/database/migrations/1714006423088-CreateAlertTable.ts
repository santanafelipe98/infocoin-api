import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAlertTable1714006423088 implements MigrationInterface {
    name = 'CreateAlertTable1714006423088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "alerts" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "triggered_at" TIMESTAMP, "user_id" uuid, "where_condition" integer, CONSTRAINT "REL_4d67f2ea49bbf1d39aa0247a79" UNIQUE ("where_condition"), CONSTRAINT "PK_60f895662df096bfcdfab7f4b96" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "alerts" ADD CONSTRAINT "FK_f1eba840c1761991f142affee66" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "alerts" ADD CONSTRAINT "FK_4d67f2ea49bbf1d39aa0247a796" FOREIGN KEY ("where_condition") REFERENCES "conditions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "alerts" DROP CONSTRAINT "FK_4d67f2ea49bbf1d39aa0247a796"`);
        await queryRunner.query(`ALTER TABLE "alerts" DROP CONSTRAINT "FK_f1eba840c1761991f142affee66"`);
        await queryRunner.query(`DROP TABLE "alerts"`);
    }

}
