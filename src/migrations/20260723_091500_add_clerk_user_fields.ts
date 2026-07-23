import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export const name = '20260723_091500_add_clerk_user_fields'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "clerk_user_id" varchar;
    ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name" varchar;
    CREATE UNIQUE INDEX IF NOT EXISTS "users_clerk_user_id_idx"
      ON "users" USING btree ("clerk_user_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "users_clerk_user_id_idx";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "clerk_user_id";
    ALTER TABLE "users" DROP COLUMN IF EXISTS "name";
  `)
}
