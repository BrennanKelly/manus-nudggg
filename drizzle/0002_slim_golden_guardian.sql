ALTER TABLE `habits` ADD `currentStreak` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `habits` ADD `longestStreak` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `habits` ADD `lastCompletedDate` date;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `currentStreak` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `longestStreak` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `lastCheckInDate` date;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `streakFreezeAvailable` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `totalCheckIns` int DEFAULT 0 NOT NULL;