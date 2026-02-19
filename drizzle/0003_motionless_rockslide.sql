CREATE TABLE `daily_check_ins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`checkInDate` date NOT NULL,
	`mood` enum('great','good','okay','bad','terrible'),
	`habitLoggedId` int,
	`journalNote` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_check_ins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `streak_milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`milestoneType` enum('7day','14day','30day','60day','100day','365day') NOT NULL,
	`achievedAt` timestamp NOT NULL DEFAULT (now()),
	`celebrated` boolean NOT NULL DEFAULT false,
	CONSTRAINT `streak_milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `daily_check_ins` ADD CONSTRAINT `daily_check_ins_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `streak_milestones` ADD CONSTRAINT `streak_milestones_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;