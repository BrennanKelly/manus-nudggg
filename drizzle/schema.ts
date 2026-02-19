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
  preferredNudgeTimes: json("preferredNudgeTimes").$type<string[]>(),
  frictionPoints: text("frictionPoints"),
  whyMissingSocial: text("whyMissingSocial"),
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
  category: varchar("category", { length: 100 }),
  whyItMatters: text("whyItMatters"),
  targetDate: date("targetDate"),
  priority: int("priority").default(1),
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
  name: text("name").notNull(),
  frequencyType: mysqlEnum("frequencyType", ["daily", "weekly"]).default("daily").notNull(),
  frequencyCount: int("frequencyCount").default(1),
  reminderTime: varchar("reminderTime", { length: 5 }),
  status: mysqlEnum("status", ["active", "paused", "completed"]).default("active").notNull(),
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
