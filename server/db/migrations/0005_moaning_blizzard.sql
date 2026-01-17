CREATE TABLE `contact_feedbacks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`contact_request_id` integer NOT NULL,
	`exchange_happened` integer NOT NULL,
	`usefulness_rating` integer,
	`comment` text,
	`created_at` integer,
	FOREIGN KEY (`contact_request_id`) REFERENCES `contact_requests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contact_feedbacks_contact_request_id_unique` ON `contact_feedbacks` (`contact_request_id`);--> statement-breakpoint
ALTER TABLE `contact_requests` ADD `feedback_token` text;--> statement-breakpoint
ALTER TABLE `contact_requests` ADD `feedback_requested_at` integer;--> statement-breakpoint
CREATE UNIQUE INDEX `contact_requests_feedback_token_unique` ON `contact_requests` (`feedback_token`);