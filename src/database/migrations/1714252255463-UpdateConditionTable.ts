import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateConditionTable1714252255463 implements MigrationInterface {
    name = 'UpdateConditionTable1714252255463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conditions" ALTER COLUMN "condition_type_id" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conditions" ALTER COLUMN "condition_type_id" DROP NOT NULL`);
    }

}
