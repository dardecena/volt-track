import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1786712306976 implements MigrationInterface {
    name = 'Migration1786712306976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "robot" ("id" character varying(5) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_b4fbeccee808e9f8ffe2540b0c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."robot_status_chargingstate_enum" AS ENUM('idle', 'charging', 'error', 'offline')`);
        await queryRunner.query(`CREATE TABLE "robot_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "robotId" character varying(5) NOT NULL, "batteryLevel" numeric NOT NULL, "chargingState" "public"."robot_status_chargingstate_enum" NOT NULL, "lastSeen" TIMESTAMP WITH TIME ZONE NOT NULL, "errorCode" integer, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f38528863545ee89f582c92a69d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f47a35a5da1b834505ee891f5d" ON "robot_status"  ("robotId") `);
        await queryRunner.query(`ALTER TABLE "robot_status" ADD CONSTRAINT "FK_f47a35a5da1b834505ee891f5dc" FOREIGN KEY ("robotId") REFERENCES "robot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "robot_status" DROP CONSTRAINT "FK_f47a35a5da1b834505ee891f5dc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f47a35a5da1b834505ee891f5d"`);
        await queryRunner.query(`DROP TABLE "robot_status"`);
        await queryRunner.query(`DROP TYPE "public"."robot_status_chargingstate_enum"`);
        await queryRunner.query(`DROP TABLE "robot"`);
    }

}
