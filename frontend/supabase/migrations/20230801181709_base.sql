-- -------------------------------------------------------------
--
-- Database: postgres
-- Generation Time: 2023-08-01 17:17:12.3670
-- -------------------------------------------------------------


-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

DROP TYPE IF EXISTS "public"."datasources_status_enum";
CREATE TYPE "public"."datasources_status_enum" AS ENUM ('queued', 'processing', 'ready');

-- Table Definition
CREATE TABLE "public"."datasources" (
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "type" text NOT NULL,
    "meta" jsonb NOT NULL DEFAULT '{}'::jsonb,
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "datastore_id" uuid NOT NULL,
    "status" "public"."datasources_status_enum" NOT NULL DEFAULT 'queued'::datasources_status_enum,
    "organization" text NOT NULL,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."datastores" (
    "name" text,
    "created_at" timestamptz DEFAULT now(),
    "organization_id" text,
    "roles" _jsonb NOT NULL DEFAULT '{}'::jsonb[],
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."organizations" (
    "id" text NOT NULL,
    "created_at" timestamptz DEFAULT now(),
    "name" text,
    "photo" text,
    "logo" text,
    PRIMARY KEY ("id")
);

-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."profiles" (
    "id" uuid NOT NULL,
    "created_at" timestamptz DEFAULT now(),
    "full_name" text,
    "avatar_url" text,
    "organization_id" text,
    "role" text,
    PRIMARY KEY ("id")
);

ALTER TABLE "public"."datasources" ADD FOREIGN KEY ("organization") REFERENCES "public"."organizations"("id");
ALTER TABLE "public"."datasources" ADD FOREIGN KEY ("datastore_id") REFERENCES "public"."datastores"("id");
ALTER TABLE "public"."datastores" ADD FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;
ALTER TABLE "public"."profiles" ADD FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;
ALTER TABLE "public"."profiles" ADD FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE CASCADE;
