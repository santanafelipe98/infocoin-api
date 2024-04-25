import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConditionTable1714004286818 implements MigrationInterface {
    name = 'CreateConditionTable1714004286818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "conditions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "value" character varying NOT NULL, "condition_type_id" integer, CONSTRAINT "PK_3938bdf2933c08ac7af7e0e15e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "conditions" ADD CONSTRAINT "FK_ff1a67d54f39c7454ffcaa26499" FOREIGN KEY ("condition_type_id") REFERENCES "condition_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conditions" DROP CONSTRAINT "FK_ff1a67d54f39c7454ffcaa26499"`);
        await queryRunner.query(`DROP TABLE "conditions"`);
    }

}
