import { MigrationInterface, QueryRunner } from "typeorm";

export class SampleDatabase1730692759443 implements MigrationInterface {
    name = 'SampleDatabase1730692759443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(256) NOT NULL, \`password\` varchar(256) NOT NULL, \`email\` varchar(256) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`article\` (\`id\` int UNSIGNED NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` text NULL, \`tags\` text NOT NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_token\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`refresh_token\` longtext NOT NULL, \`access_token\` longtext NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`user_token\``);
        await queryRunner.query(`DROP TABLE \`article\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
    }

}
