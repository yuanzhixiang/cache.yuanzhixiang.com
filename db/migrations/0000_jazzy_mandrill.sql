CREATE TABLE "cache_yuanzhixiang_com"."agents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cache_yuanzhixiang_com"."domain_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"domain" varchar(255) NOT NULL,
	"apex_domain" varchar(255) NOT NULL,
	"registration_date" date,
	"registration_prefix" varchar(8),
	"registration_source" varchar(32),
	"registration_fetched_at" timestamp with time zone,
	"traffic_source" varchar(32),
	"traffic_fetched_at" timestamp with time zone,
	"negative_cache_until" timestamp with time zone,
	"last_error_code" varchar(64),
	"last_error_message" text,
	"raw_aitdk" jsonb,
	"raw_whois" jsonb
);
--> statement-breakpoint
CREATE TABLE "cache_yuanzhixiang_com"."domain_sync_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"domain_id" uuid,
	"domain" varchar(255) NOT NULL,
	"provider" varchar(32) NOT NULL,
	"success" boolean NOT NULL,
	"http_status" integer,
	"error_code" varchar(64),
	"error_message" text,
	"response_excerpt" text
);
--> statement-breakpoint
CREATE TABLE "cache_yuanzhixiang_com"."domain_traffic_monthly" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"domain_id" uuid NOT NULL,
	"metric_month" date NOT NULL,
	"visits" bigint NOT NULL,
	"source" varchar(32) DEFAULT 'aitdk' NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL,
	"raw_payload" jsonb
);
--> statement-breakpoint
ALTER TABLE "cache_yuanzhixiang_com"."domain_sync_logs" ADD CONSTRAINT "domain_sync_logs_domain_id_domain_profiles_id_fk" FOREIGN KEY ("domain_id") REFERENCES "cache_yuanzhixiang_com"."domain_profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cache_yuanzhixiang_com"."domain_traffic_monthly" ADD CONSTRAINT "domain_traffic_monthly_domain_id_domain_profiles_id_fk" FOREIGN KEY ("domain_id") REFERENCES "cache_yuanzhixiang_com"."domain_profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "agents_name_idx" ON "cache_yuanzhixiang_com"."agents" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "domain_profiles_domain_uidx" ON "cache_yuanzhixiang_com"."domain_profiles" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "domain_profiles_apex_domain_idx" ON "cache_yuanzhixiang_com"."domain_profiles" USING btree ("apex_domain");--> statement-breakpoint
CREATE INDEX "domain_profiles_negative_cache_until_idx" ON "cache_yuanzhixiang_com"."domain_profiles" USING btree ("negative_cache_until");--> statement-breakpoint
CREATE INDEX "domain_profiles_updated_at_idx" ON "cache_yuanzhixiang_com"."domain_profiles" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "domain_sync_logs_domain_created_at_idx" ON "cache_yuanzhixiang_com"."domain_sync_logs" USING btree ("domain","created_at");--> statement-breakpoint
CREATE INDEX "domain_sync_logs_provider_created_at_idx" ON "cache_yuanzhixiang_com"."domain_sync_logs" USING btree ("provider","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "domain_traffic_monthly_domain_month_source_uidx" ON "cache_yuanzhixiang_com"."domain_traffic_monthly" USING btree ("domain_id","metric_month","source");--> statement-breakpoint
CREATE INDEX "domain_traffic_monthly_domain_month_idx" ON "cache_yuanzhixiang_com"."domain_traffic_monthly" USING btree ("domain_id","metric_month");--> statement-breakpoint
CREATE INDEX "domain_traffic_monthly_fetched_at_idx" ON "cache_yuanzhixiang_com"."domain_traffic_monthly" USING btree ("fetched_at");