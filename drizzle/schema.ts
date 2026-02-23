import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, date, json, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User profile with onboarding preferences
 */
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  timezone: varchar("timezone", { length: 100 }).default("UTC"),
  motivationStyle: varchar("motivationStyle", { length: 50 }).default("supportive"),
  quietHoursStart: varchar("quietHoursStart", { length: 5 }),
  quietHoursEnd: varchar("quietHoursEnd", { length: 5 }),
  onboardingComplete: boolean("onboardingComplete").default(false).notNull(),
  selectedCategories: json("selectedCategories").$type<string[]>(),
  confidenceLevel: int("confidenceLevel"),
  biggestObstacle: text("biggestObstacle"),
  preferredNudgeTimes: json("preferredNudgeTimes").$type<string[]>(),
  frictionPoints: text("frictionPoints"),
  whyMissingSocial: text("whyMissingSocial"),
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastCheckInDate: date("lastCheckInDate"),
  streakFreezeAvailable: boolean("streakFreezeAvailable").default(true).notNull(),
  totalCheckIns: int("totalCheckIns").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

/**
 * User goals
 */
export const goals = mysqlTable("goals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  whyItMatters: text("whyItMatters"),
  targetDate: date("targetDate"),
  priority: int("priority").default(1),
  confidenceLevel: int("confidenceLevel"),
  status: mysqlEnum("status", ["active", "paused", "completed"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = typeof goals.$inferInsert;

/**
 * User habits
 */
export const habits = mysqlTable("habits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  goalId: int("goalId").references(() => goals.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  frequencyType: mysqlEnum("frequencyType", ["daily", "weekly", "custom"]).default("weekly").notNull(),
  frequencyCount: int("frequencyCount").default(3),
  scheduledDays: json("scheduledDays").$type<number[]>(),
  timePreference: mysqlEnum("timePreference", ["morning", "afternoon", "evening", "flexible"]).default("flexible"),
  reminderTime: varchar("reminderTime", { length: 5 }),
  status: mysqlEnum("status", ["active", "paused", "completed"]).default("active").notNull(),
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastCompletedDate: date("lastCompletedDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Habit = typeof habits.$inferSelect;
export type InsertHabit = typeof habits.$inferInsert;

/**
 * Habit completion logs
 */
export const habitLogs = mysqlTable("habit_logs", {
  id: int("id").autoincrement().primaryKey(),
  habitId: int("habitId").notNull().references(() => habits.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  note: text("note"),
});

export type HabitLog = typeof habitLogs.$inferSelect;
export type InsertHabitLog = typeof habitLogs.$inferInsert;

/**
 * Journal entries
 */
export const journals = mysqlTable("journals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  entryText: text("entryText").notNull(),
  moodScore: int("moodScore"),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Journal = typeof journals.$inferSelect;
export type InsertJournal = typeof journals.$inferInsert;

/**
 * AI-generated journal reflections
 */
export const journalAI = mysqlTable("journal_ai", {
  id: int("id").autoincrement().primaryKey(),
  journalId: int("journalId").notNull().references(() => journals.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  reflectionText: text("reflectionText").notNull(),
  themes: json("themes").$type<string[]>(),
  sentiment: json("sentiment").$type<{ score: number; label: string }>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type JournalAI = typeof journalAI.$inferSelect;
export type InsertJournalAI = typeof journalAI.$inferInsert;

/**
 * Nudge settings per user
 */
export const nudgeSettings = mysqlTable("nudge_settings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  enabled: boolean("enabled").default(true).notNull(),
  cadence: json("cadence").$type<{ daily?: boolean; weekly?: boolean }>(),
  preferredTimes: json("preferredTimes").$type<string[]>(),
  style: varchar("style", { length: 50 }).default("supportive"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NudgeSetting = typeof nudgeSettings.$inferSelect;
export type InsertNudgeSetting = typeof nudgeSettings.$inferInsert;

/**
 * Notification/nudge log
 */
export const notificationLog = mysqlTable("notification_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  nudgeType: varchar("nudgeType", { length: 50 }).notNull(),
  triggerReason: text("triggerReason"),
  content: text("content").notNull(),
  channel: varchar("channel", { length: 50 }).default("in-app").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  openedAt: timestamp("openedAt"),
  actionTaken: json("actionTaken").$type<{ type: string; timestamp: number }>(),
});

export type NotificationLog = typeof notificationLog.$inferSelect;
export type InsertNotificationLog = typeof notificationLog.$inferInsert;

/**
 * Daily check-ins for streak tracking
 */
export const dailyCheckIns = mysqlTable("daily_check_ins", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  checkInDate: date("checkInDate").notNull(),
  mood: mysqlEnum("mood", ["great", "good", "okay", "bad", "terrible"]),
  habitLoggedId: int("habitLoggedId"),
  journalNote: text("journalNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyCheckIn = typeof dailyCheckIns.$inferSelect;
export type InsertDailyCheckIn = typeof dailyCheckIns.$inferInsert;

/**
 * Streak milestones achieved by users
 */
export const streakMilestones = mysqlTable("streak_milestones", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  milestoneType: mysqlEnum("milestoneType", ["7day", "14day", "30day", "60day", "100day", "365day"]).notNull(),
  achievedAt: timestamp("achievedAt").defaultNow().notNull(),
  celebrated: boolean("celebrated").default(false).notNull(),
});

export type StreakMilestone = typeof streakMilestones.$inferSelect;
export type InsertStreakMilestone = typeof streakMilestones.$inferInsert;


/**
 * Curated Amazon products for storefront
 */
export const storefrontProducts = mysqlTable("storefront_products", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  amazonUrl: text("amazonUrl").notNull(),
  imageUrl: text("imageUrl"),
  price: varchar("price", { length: 20 }),
  whyItHelps: text("whyItHelps").notNull(),
  tags: json("tags").$type<string[]>().notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  bundleId: int("bundleId"),
  sortOrder: int("sortOrder").default(0),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StorefrontProduct = typeof storefrontProducts.$inferSelect;
export type InsertStorefrontProduct = typeof storefrontProducts.$inferInsert;

/**
 * Product bundles (e.g., "Strength Starter Kit")
 */
export const productBundles = mysqlTable("product_bundles", {
  id: int("id").autoincrement().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  imageUrl: text("imageUrl"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductBundle = typeof productBundles.$inferSelect;
export type InsertProductBundle = typeof productBundles.$inferInsert;
