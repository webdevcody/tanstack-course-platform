CREATE TABLE "app_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"segmentId" serial NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app_progress" ADD CONSTRAINT "app_progress_userId_app_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "progress_user_id_segment_id_idx" ON "app_progress" USING btree ("userId","segmentId");