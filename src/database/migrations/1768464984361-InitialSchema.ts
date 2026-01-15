import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1768464984361 implements MigrationInterface {
    name = 'InitialSchema1768464984361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tracker_activity_replies" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "modified_by" integer, "activity_id" integer NOT NULL, "content" text NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_7912e612bd9cf57fd0658620191" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tracker_activities" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "modified_by" integer, "tracker_id" integer NOT NULL, "title" character varying NOT NULL, "description" text, "department_id" integer NOT NULL, "status" integer NOT NULL DEFAULT '1', "progress" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_3e6878103292115f52bacd8312c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tracker_replies" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "modified_by" integer, "tracker_id" integer NOT NULL, "content" text NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_05070ef4fc1fcf91ddc39d9553d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trackers" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "modified_by" integer, "title" character varying NOT NULL, "description" text, "type" character varying NOT NULL, "status" integer NOT NULL DEFAULT '1', "progress" integer NOT NULL DEFAULT '0', "budget" numeric(15,2) NOT NULL DEFAULT '0', "start_date" date, "end_date" date, CONSTRAINT "PK_e096eff85edfb2f131883cc92ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "summary_tasks" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "modified_by" integer, "summary_id" integer NOT NULL, "title" character varying NOT NULL, "description" text, "department_id" integer NOT NULL, "status" integer NOT NULL DEFAULT '1', "progress" integer NOT NULL DEFAULT '0', "timeline" date, "deadline" date, CONSTRAINT "PK_bdd709946022967d4dd6efb6dce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "summary_replies" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "modified_by" integer, "summary_id" integer NOT NULL, "content" text NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_95569914299345a94ca213756a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "summaries" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, "modified_by" integer, "reference_number" character varying NOT NULL, "subject" character varying NOT NULL, "description" text, "date" date NOT NULL, "initiator_department_id" integer NOT NULL, "status" integer NOT NULL DEFAULT '1', "priority" character varying NOT NULL DEFAULT 'medium', CONSTRAINT "PK_448e2a87db98ce2a6ee8946f392" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "khushhal_task_assignments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "khushhal_task_id" integer NOT NULL, "department_id" integer NOT NULL, "status" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_5245871c36916abaae34cef750e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tracker_departments" ("tracker_id" integer NOT NULL, "department_id" integer NOT NULL, CONSTRAINT "PK_3f3b9d5146c87eb7ba47144b39b" PRIMARY KEY ("tracker_id", "department_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6ffb8ef19f67498efa6ab76cb1" ON "tracker_departments" ("tracker_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_afb4254c14f233e29cd1be48af" ON "tracker_departments" ("department_id") `);
        await queryRunner.query(`ALTER TABLE "khushhal_tasks" ADD "subject_tasks" text`);
        await queryRunner.query(`ALTER TABLE "khushhal_tasks" ADD "progress_so_far" text`);
        await queryRunner.query(`ALTER TABLE "khushhal_tasks" ADD "expected_outcomes" text`);
        await queryRunner.query(`ALTER TABLE "khushhal_tasks" ADD "action_by_note" text`);
        await queryRunner.query(`ALTER TABLE "khushhal_tasks" ADD "timeline_date" date`);
        await queryRunner.query(`ALTER TABLE "khushhal_tasks" ADD "attachments" json`);
        await queryRunner.query(`ALTER TABLE "khushhal_progress" ADD "department_id" integer`);
        await queryRunner.query(`ALTER TABLE "khushhal_tasks" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "khushhal_tasks" ALTER COLUMN "target_date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "khushhal_progress" ALTER COLUMN "date" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tracker_activity_replies" ADD CONSTRAINT "FK_08bcc8813e57fb18e7ed940c144" FOREIGN KEY ("activity_id") REFERENCES "tracker_activities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracker_activity_replies" ADD CONSTRAINT "FK_0d0944e3a57ebf9f4a04e6aa9ed" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracker_activities" ADD CONSTRAINT "FK_ff6749c36174428dbab80106f1e" FOREIGN KEY ("tracker_id") REFERENCES "trackers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracker_activities" ADD CONSTRAINT "FK_4f782c080b85d12bc4dd189b704" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracker_replies" ADD CONSTRAINT "FK_f1582a1bb4597c705d49fbe12d5" FOREIGN KEY ("tracker_id") REFERENCES "trackers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracker_replies" ADD CONSTRAINT "FK_ac45f131652b076b8d2ad1b12d2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "summary_tasks" ADD CONSTRAINT "FK_75da92e8d9089ec7fda8d08e212" FOREIGN KEY ("summary_id") REFERENCES "summaries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "summary_tasks" ADD CONSTRAINT "FK_173a6f4e865b9446d31733558d4" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "summary_replies" ADD CONSTRAINT "FK_9023a34b98ee956d9d0eb885ace" FOREIGN KEY ("summary_id") REFERENCES "summaries"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "summary_replies" ADD CONSTRAINT "FK_26f8e0959b8f8e93a7e73f27314" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "summaries" ADD CONSTRAINT "FK_3492af7d846c88dd0a8b19556fb" FOREIGN KEY ("initiator_department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "khushhal_task_assignments" ADD CONSTRAINT "FK_506e670526bc4c930b5435219cc" FOREIGN KEY ("khushhal_task_id") REFERENCES "khushhal_tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "khushhal_task_assignments" ADD CONSTRAINT "FK_7190b85972409d6b45b61328c03" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "khushhal_progress" ADD CONSTRAINT "FK_a98179219c8cb4db398fdf512a2" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracker_departments" ADD CONSTRAINT "FK_6ffb8ef19f67498efa6ab76cb11" FOREIGN KEY ("tracker_id") REFERENCES "trackers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tracker_departments" ADD CONSTRAINT "FK_afb4254c14f233e29cd1be48af6" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracker_departments" DROP CONSTRAINT "FK_afb4254c14f233e29cd1be48af6"`);
        await queryRunner.query(`ALTER TABLE "tracker_departments" DROP CONSTRAINT "FK_6ffb8ef19f67498efa6ab76cb11"`);
        await queryRunner.query(`ALTER TABLE "khushhal_progress" DROP CONSTRAINT "FK_a98179219c8cb4db398fdf512a2"`);
        await queryRunner.query(`ALTER TABLE "khushhal_task_assignments" DROP CONSTRAINT "FK_7190b85972409d6b45b61328c03"`);
        await queryRunner.query(`ALTER TABLE "khushhal_task_assignments" DROP CONSTRAINT "FK_506e670526bc4c930b5435219cc"`);
        await queryRunner.query(`ALTER TABLE "summaries" DROP CONSTRAINT "FK_3492af7d846c88dd0a8b19556fb"`);
        await queryRunner.query(`ALTER TABLE "summary_replies" DROP CONSTRAINT "FK_26f8e0959b8f8e93a7e73f27314"`);
        await queryRunner.query(`ALTER TABLE "summary_replies" DROP CONSTRAINT "FK_9023a34b98ee956d9d0eb885ace"`);
        await queryRunner.query(`ALTER TABLE "summary_tasks" DROP CONSTRAINT "FK_173a6f4e865b9446d31733558d4"`);
        await queryRunner.query(`ALTER TABLE "summary_tasks" DROP CONSTRAINT "FK_75da92e8d9089ec7fda8d08e212"`);
        await queryRunner.query(`ALTER TABLE "tracker_replies" DROP CONSTRAINT "FK_ac45f131652b076b8d2ad1b12d2"`);
        await queryRunner.query(`ALTER TABLE "tracker_replies" DROP CONSTRAINT "FK_f1582a1bb4597c705d49fbe12d5"`);
        await queryRunner.query(`ALTER TABLE "tracker_activities" DROP CONSTRAINT "FK_4f782c080b85d12bc4dd189b704"`);
        await queryRunner.query(`ALTER TABLE "tracker_activities" DROP CONSTRAINT "FK_ff6749c36174428dbab80106f1e"`);
        await queryRunner.query(`ALTER TABLE "tracker_activity_replies" DROP CONSTRAINT "FK_0d0944e3a57ebf9f4a04e6aa9ed"`);
        await queryRunner.query(`ALTER TABLE "tracker_activity_replies" DROP CONSTRAINT "FK_08bcc8813e57fb18e7ed940c144"`);
        await queryRunner.query(`ALTER TABLE "khushhal_progress" ALTER COLUMN "date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "khushhal_tasks" ALTER COLUMN "target_date" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "khushhal_tasks" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "khushhal_progress" DROP COLUMN "department_id"`);
        await queryRunner.query(`ALTER TABLE "khushhal_tasks" DROP COLUMN "attachments"`);
        await queryRunner.query(`ALTER TABLE "khushhal_tasks" DROP COLUMN "timeline_date"`);
        await queryRunner.query(`ALTER TABLE "khushhal_tasks" DROP COLUMN "action_by_note"`);
        await queryRunner.query(`ALTER TABLE "khushhal_tasks" DROP COLUMN "expected_outcomes"`);
        await queryRunner.query(`ALTER TABLE "khushhal_tasks" DROP COLUMN "progress_so_far"`);
        await queryRunner.query(`ALTER TABLE "khushhal_tasks" DROP COLUMN "subject_tasks"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_afb4254c14f233e29cd1be48af"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ffb8ef19f67498efa6ab76cb1"`);
        await queryRunner.query(`DROP TABLE "tracker_departments"`);
        await queryRunner.query(`DROP TABLE "khushhal_task_assignments"`);
        await queryRunner.query(`DROP TABLE "summaries"`);
        await queryRunner.query(`DROP TABLE "summary_replies"`);
        await queryRunner.query(`DROP TABLE "summary_tasks"`);
        await queryRunner.query(`DROP TABLE "trackers"`);
        await queryRunner.query(`DROP TABLE "tracker_replies"`);
        await queryRunner.query(`DROP TABLE "tracker_activities"`);
        await queryRunner.query(`DROP TABLE "tracker_activity_replies"`);
    }

}
