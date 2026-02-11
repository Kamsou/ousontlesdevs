ALTER TABLE `comments` ADD `offer_id` integer REFERENCES offers(id);--> statement-breakpoint
ALTER TABLE `developers` ADD `comments_notifications_enabled` integer DEFAULT true;