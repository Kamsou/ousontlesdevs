CREATE TABLE `developer_looking_for` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`developer_id` integer NOT NULL,
	`type` text NOT NULL,
	FOREIGN KEY (`developer_id`) REFERENCES `developers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `developers` ADD `looking_for_since` integer;--> statement-breakpoint
ALTER TABLE `developers` ADD `looking_for_reminder_sent_at` integer;--> statement-breakpoint
ALTER TABLE `developers` ADD `looking_for_token` text;
