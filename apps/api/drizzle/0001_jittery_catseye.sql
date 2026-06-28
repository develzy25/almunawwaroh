ALTER TABLE `users` RENAME COLUMN `email` TO `username`;--> statement-breakpoint
DROP INDEX IF EXISTS `users_email_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_idx` ON `users` (`username`);