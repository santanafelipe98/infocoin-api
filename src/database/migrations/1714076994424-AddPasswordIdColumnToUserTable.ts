import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordIdColumnToUserTable1714076994424 implements MigrationInterface {
    name = 'AddPasswordIdColumnToUserTable1714076994424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password_id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password_id"`);
    }

}
