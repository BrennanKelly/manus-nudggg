CREATE TABLE `product_bundles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` varchar(100) NOT NULL,
	`imageUrl` text,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `product_bundles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `storefront_products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` text NOT NULL,
	`amazonUrl` text NOT NULL,
	`imageUrl` text,
	`price` varchar(20),
	`whyItHelps` text NOT NULL,
	`tags` json NOT NULL,
	`category` varchar(100) NOT NULL,
	`bundleId` int,
	`sortOrder` int DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `storefront_products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `goals` MODIFY COLUMN `category` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `habits` MODIFY COLUMN `frequencyType` enum('daily','weekly','custom') NOT NULL DEFAULT 'weekly';--> statement-breakpoint
ALTER TABLE `habits` MODIFY COLUMN `frequencyCount` int DEFAULT 3;--> statement-breakpoint
ALTER TABLE `goals` ADD `confidenceLevel` int;--> statement-breakpoint
ALTER TABLE `habits` ADD `goalId` int;--> statement-breakpoint
ALTER TABLE `habits` ADD `scheduledDays` json;--> statement-breakpoint
ALTER TABLE `habits` ADD `timePreference` enum('morning','afternoon','evening','flexible') DEFAULT 'flexible';--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `selectedCategories` json;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `confidenceLevel` int;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `biggestObstacle` text;--> statement-breakpoint
ALTER TABLE `habits` ADD CONSTRAINT `habits_goalId_goals_id_fk` FOREIGN KEY (`goalId`) REFERENCES `goals`(`id`) ON DELETE cascade ON UPDATE no action;