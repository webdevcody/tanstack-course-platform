CREATE TABLE "app_module" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app_segment" ALTER COLUMN "moduleId" TYPE integer USING "moduleId"::integer;
--> statement-breakpoint
ALTER TABLE "app_segment" ADD CONSTRAINT "app_segment_moduleId_app_module_id_fk" FOREIGN KEY ("moduleId") REFERENCES "public"."app_module"("id") ON DELETE cascade ON UPDATE no action;