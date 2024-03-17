import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTodosTable1710704342616 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
        create table todos (
            id bigserial primary key,
            name text
        );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`drop table todos;`);
    }

}
