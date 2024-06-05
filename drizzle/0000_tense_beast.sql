DO $$ BEGIN
 CREATE TYPE "public"."category" AS ENUM('food', 'beverage', 'snack');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "solmed168_order" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_id" integer,
	"order_date" timestamp with time zone DEFAULT now(),
	"total_amount" numeric,
	"products" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "solmed168_product" (
	"id" uuid PRIMARY KEY NOT NULL,
	"price" integer,
	"category" "category",
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone
);
