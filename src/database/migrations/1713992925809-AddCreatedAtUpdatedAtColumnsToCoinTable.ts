import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtUpdatedAtColumnsToCoinTable1713992925809 implements MigrationInterface {
    name = 'AddCreatedAtUpdatedAtColumnsToCoinTable1713992925809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coins" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "coins" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coins" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "coins" DROP COLUMN "created_at"`);
    }

}
