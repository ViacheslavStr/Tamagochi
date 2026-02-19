DO $$ BEGIN
 CREATE TYPE "user_media_type" AS ENUM('photo', 'video');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"file_path" text NOT NULL,
	"media_type" "user_media_type" NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"height" text,
	"build" text,
	"ethnicity" text,
	"education" text,
	"interests" jsonb DEFAULT '[]'::jsonb,
	"openness" integer,
	"conscientiousness" integer,
	"extraversion" integer,
	"agreeableness" integer,
	"neuroticism" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
DROP TABLE "family_parents";--> statement-breakpoint
DROP TABLE "parent_media";--> statement-breakpoint
DROP TABLE "parent_profiles";--> statement-breakpoint
ALTER TABLE "families" DROP CONSTRAINT "families_created_by_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "families" ADD COLUMN "father_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "families" ADD COLUMN "mother_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "families" ADD CONSTRAINT "families_father_id_users_id_fk" FOREIGN KEY ("father_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "families" ADD CONSTRAINT "families_mother_id_users_id_fk" FOREIGN KEY ("mother_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "families" DROP COLUMN IF EXISTS "created_by_user_id";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_media" ADD CONSTRAINT "user_media_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
