ALTER TABLE "user_profiles" ADD COLUMN "first_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "last_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "age" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "role" "user_role" NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "first_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "last_name";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "age";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "role";