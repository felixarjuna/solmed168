DO $$ BEGIN
 CREATE TYPE "public"."payment_method" AS ENUM('cash', 'qris', 'transfer');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."category" AS ENUM('food', 'beverage', 'snack');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."serving_method" AS ENUM('dine_in', 'takeaway');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "solmed168_order" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_id" integer NOT NULL,
	"order_date" timestamp with time zone DEFAULT now(),
	"total_amount" integer NOT NULL,
	"products" json NOT NULL,
	"payment_method" "payment_method",
	"serving_method" "serving_method"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "solmed168_product" (
	"id" uuid PRIMARY KEY NOT NULL,
	"price" integer,
	"category" "category",
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone
);
