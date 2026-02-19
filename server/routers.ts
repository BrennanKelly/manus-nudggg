import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // User Profile & Onboarding
  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserProfile(ctx.user.id);
    }),
    
    create: protectedProcedure
      .input(z.object({
        timezone: z.string().optional(),
        motivationStyle: z.enum(["supportive", "tough-love-lite", "humorous", "calm"]).optional(),
        quietHoursStart: z.string().optional(),
        quietHoursEnd: z.string().optional(),
        preferredNudgeTimes: z.array(z.string()).optional(),
        frictionPoints: z.string().optional(),
        whyMissingSocial: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createUserProfile({
          userId: ctx.user.id,
          ...input,
          onboardingComplete: true,
        });
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({
        timezone: z.string().optional(),
        motivationStyle: z.enum(["supportive", "tough-love-lite", "humorous", "calm"]).optional(),
        quietHoursStart: z.string().optional(),
        quietHoursEnd: z.string().optional(),
        preferredNudgeTimes: z.array(z.string()).optional(),
        frictionPoints: z.string().optional(),
        whyMissingSocial: z.string().optional(),
        onboardingComplete: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // Goals Management
  goals: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserGoals(ctx.user.id);
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getGoalById(input.id, ctx.user.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        category: z.string().optional(),
        whyItMatters: z.string().optional(),
        targetDate: z.string().optional(),
        priority: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createGoal({
          userId: ctx.user.id,
          title: input.title,
          category: input.category || null,
          whyItMatters: input.whyItMatters || null,
          targetDate: input.targetDate ? new Date(input.targetDate) : null,
          priority: input.priority || 1,
        });
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        category: z.string().optional(),
        whyItMatters: z.string().optional(),
        targetDate: z.string().optional(),
        priority: z.number().optional(),
        status: z.enum(["active", "paused", "completed"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, targetDate, ...rest } = input;
        const updates: any = { ...rest };
        if (targetDate !== undefined) {
          updates.targetDate = targetDate ? new Date(targetDate) : null;
        }
        await db.updateGoal(id, ctx.user.id, updates);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteGoal(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // Habits Management
  habits: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserHabits(ctx.user.id);
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getHabitById(input.id, ctx.user.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        frequencyType: z.enum(["daily", "weekly"]).optional(),
        frequencyCount: z.number().optional(),
        reminderTime: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createHabit({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        frequencyType: z.enum(["daily", "weekly"]).optional(),
        frequencyCount: z.number().optional(),
        reminderTime: z.string().optional(),
        status: z.enum(["active", "paused", "completed"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        await db.updateHabit(id, ctx.user.id, updates);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteHabit(input.id, ctx.user.id);
        return { success: true };
      }),
    
    log: protectedProcedure
      .input(z.object({
        habitId: z.number(),
        note: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.logHabitCompletion({
          habitId: input.habitId,
          userId: ctx.user.id,
          note: input.note || null,
        });
        return { success: true };
      }),
    
    logs: protectedProcedure
      .input(z.object({ habitId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getHabitLogs(input.habitId, ctx.user.id);
      }),
    
    streak: protectedProcedure
      .input(z.object({ habitId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getHabitStreak(input.habitId, ctx.user.id);
      }),
  }),

  // Journal Management
  journals: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserJournals(ctx.user.id);
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getJournalById(input.id, ctx.user.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        entryText: z.string().min(1),
        moodScore: z.number().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createJournal({
          userId: ctx.user.id,
          ...input,
          moodScore: input.moodScore || null,
          imageUrl: input.imageUrl || null,
        });
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        entryText: z.string().optional(),
        moodScore: z.number().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        await db.updateJournal(id, ctx.user.id, updates);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteJournal(input.id, ctx.user.id);
        return { success: true };
      }),
    
    // Generate AI reflection for a journal entry
    generateReflection: protectedProcedure
      .input(z.object({
        journalId: z.number(),
        entryText: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Get user profile for personalization
        const profile = await db.getUserProfile(ctx.user.id);
        const motivationStyle = profile?.motivationStyle || "supportive";
        
        // Generate AI reflection
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a ${motivationStyle} AI companion helping someone with their personal growth journey. 
              Provide a short, warm reflection on their journal entry (2-3 sentences max). 
              Be non-judgmental, encouraging, and insightful. Avoid being preachy or cringe.
              If appropriate, gently suggest one small action they could consider.`,
            },
            {
              role: "user",
              content: `Here's my journal entry: "${input.entryText}"`,
            },
          ],
        });
        
        const messageContent = response.choices[0]?.message?.content;
        const reflectionText = typeof messageContent === 'string' ? messageContent : "Thank you for sharing. Keep reflecting on your journey.";
        
        // Save AI reflection
        await db.createJournalAI({
          journalId: input.journalId,
          userId: ctx.user.id,
          reflectionText,
          themes: null,
          sentiment: null,
        });
        
        return { reflection: reflectionText };
      }),
    
    getReflection: protectedProcedure
      .input(z.object({ journalId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getJournalAI(input.journalId, ctx.user.id);
      }),
  }),

  // Nudge Settings
  nudges: router({
    getSettings: protectedProcedure.query(async ({ ctx }) => {
      return await db.getNudgeSettings(ctx.user.id);
    }),
    
    updateSettings: protectedProcedure
      .input(z.object({
        enabled: z.boolean().optional(),
        cadence: z.object({
          daily: z.boolean().optional(),
          weekly: z.boolean().optional(),
        }).optional(),
        preferredTimes: z.array(z.string()).optional(),
        style: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertNudgeSettings({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
    
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserNotifications(ctx.user.id);
    }),
    
    markOpened: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.markNotificationOpened(input.id, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
