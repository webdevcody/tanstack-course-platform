CREATE TABLE "app_comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"segmentId" serial NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app_comment" ADD CONSTRAINT "app_comment_userId_app_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."app_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_comment" ADD CONSTRAINT "app_comment_segmentId_app_segment_id_fk" FOREIGN KEY ("segmentId") REFERENCES "public"."app_segment"("id") ON DELETE cascade ON UPDATE no action;