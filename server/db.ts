import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, userProfiles, InsertUserProfile, 
  goals, InsertGoal, habits, InsertHabit, habitLogs, InsertHabitLog,
  journals, InsertJournal, journalAI, InsertJournalAI,
  nudgeSettings, InsertNudgeSetting, notificationLog, InsertNotificationLog,
  storefrontProducts, InsertStorefrontProduct
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// User Profile helpers
export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUserProfile(profile: InsertUserProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(userProfiles).values(profile);
}

export async function updateUserProfile(userId: number, updates: Partial<InsertUserProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(userProfiles).set(updates).where(eq(userProfiles.userId, userId));
}

// Goals helpers
export async function getUserGoals(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(goals).where(eq(goals.userId, userId)).orderBy(desc(goals.createdAt));
}

export async function getGoalById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(goals).where(and(eq(goals.id, id), eq(goals.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createGoal(goal: InsertGoal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(goals).values(goal);
}

export async function updateGoal(id: number, userId: number, updates: Partial<InsertGoal>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(goals).set(updates).where(and(eq(goals.id, id), eq(goals.userId, userId)));
}

export async function deleteGoal(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(goals).where(and(eq(goals.id, id), eq(goals.userId, userId)));
}

// Habits helpers
export async function getUserHabits(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(habits).where(eq(habits.userId, userId)).orderBy(desc(habits.createdAt));
}

export async function getHabitById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(habits).where(and(eq(habits.id, id), eq(habits.userId, userId))).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createHabit(habit: InsertHabit) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(habits).values(habit);
}

export async function updateHabit(id: number, userId: number, updates: Partial<InsertHabit>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(habits).set(updates).where(and(eq(habits.id, id), eq(habits.userId, userId)));
}

export async function deleteHabit(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(habits).where(and(eq(habits.id, id), eq(habits.userId, userId)));
}

// Habit Logs helpers
export async function getHabitLogs(habitId: number, userId: number, limit = 30) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.userId, userId)))
    .orderBy(desc(habitLogs.completedAt))
    .limit(limit);
}

export async function logHabitCompletion(log: InsertHabitLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(habitLogs).values(log);
}

export async function getHabitStreak(habitId: number, userId: number) {
  const db = await getDb();
  if (!db) return 0;

  const logs = await db.select().from(habitLogs)
    .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.userId, userId)))
    .orderBy(desc(habitLogs.completedAt));

  if (logs.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < logs.length; i++) {
    const logDate = new Date(logs[i]!.completedAt);
    logDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);

    if (logDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// Journals helpers
export async function getUserJournals(userId: number, limit = 30) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(journals)
    .where(eq(journals.userId, userId))
    .orderBy(desc(journals.createdAt))
    .limit(limit);
}

export async function getJournalById(id: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(journals)
    .where(and(eq(journals.id, id), eq(journals.userId, userId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createJournal(journal: InsertJournal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(journals).values(journal);
}

export async function updateJournal(id: number, userId: number, updates: Partial<InsertJournal>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(journals).set(updates).where(and(eq(journals.id, id), eq(journals.userId, userId)));
}

export async function deleteJournal(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(journals).where(and(eq(journals.id, id), eq(journals.userId, userId)));
}

// Journal AI helpers
export async function getJournalAI(journalId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(journalAI)
    .where(and(eq(journalAI.journalId, journalId), eq(journalAI.userId, userId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createJournalAI(ai: InsertJournalAI) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(journalAI).values(ai);
}

// Nudge Settings helpers
export async function getNudgeSettings(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(nudgeSettings)
    .where(eq(nudgeSettings.userId, userId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertNudgeSettings(settings: InsertNudgeSetting) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(nudgeSettings).values(settings).onDuplicateKeyUpdate({
    set: {
      enabled: settings.enabled,
      cadence: settings.cadence,
      preferredTimes: settings.preferredTimes,
      style: settings.style,
    },
  });
}

// Notification Log helpers
export async function getUserNotifications(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(notificationLog)
    .where(eq(notificationLog.userId, userId))
    .orderBy(desc(notificationLog.sentAt))
    .limit(limit);
}

export async function createNotification(notification: InsertNotificationLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(notificationLog).values(notification);
}

export async function markNotificationOpened(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(notificationLog)
    .set({ openedAt: new Date() })
    .where(and(eq(notificationLog.id, id), eq(notificationLog.userId, userId)));
}


// Storefront Products
export async function getAllStorefrontProducts() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(storefrontProducts)
    .where(eq(storefrontProducts.active, true))
    .orderBy(storefrontProducts.sortOrder);
}

export async function createStorefrontProduct(product: InsertStorefrontProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(storefrontProducts).values(product);
}
