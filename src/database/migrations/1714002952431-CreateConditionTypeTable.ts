import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConditionTypeTable1714002952431 implements MigrationInterface {
    name = 'CreateConditionTypeTable1714002952431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "condition_types" ("id" SERIAL NOT NULL, "description" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1892c9e372d9d6acd8a408a77e2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "condition_types"`);
    }

}
