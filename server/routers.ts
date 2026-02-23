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
        selectedCategories: z.array(z.string()).optional(),
        confidenceLevel: z.number().optional(),
        biggestObstacle: z.string().optional(),
        onboardingComplete: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createUserProfile({
          userId: ctx.user.id,
          ...input,
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
        category: z.string().min(1),
        whyItMatters: z.string().optional(),
        targetDate: z.string().optional(),
        priority: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createGoal({
          userId: ctx.user.id,
          title: input.title,
          category: input.category,
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
        goalId: z.number().optional(),
        frequencyType: z.enum(["daily", "weekly", "custom"]).optional(),
        frequencyCount: z.number().optional(),
        scheduledDays: z.array(z.number()).optional(),
        timePreference: z.enum(["morning", "afternoon", "evening", "flexible"]).optional(),
        reminderTime: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createHabit({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
    
    generateSuggestions: protectedProcedure
      .input(z.object({
        goalTitle: z.string(),
        category: z.string(),
        whyItMatters: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const prompt = `You are a habit formation expert. Generate 3 specific, actionable habit suggestions for this goal:

Goal: ${input.goalTitle}
Category: ${input.category}
${input.whyItMatters ? `Why it matters: ${input.whyItMatters}` : ""}

For each habit:
1. Make it concrete and measurable
2. Keep it small enough to do consistently (2-minute rule)
3. Explain briefly why this habit supports the goal

Return ONLY a JSON array with this structure:
[{"name": "habit name", "reasoning": "why this helps"}]

No markdown, no extra text, just the JSON array.`;

        try {
          const response = await invokeLLM({
            messages: [
              { role: "system", content: "You are a habit formation expert. Always return valid JSON only." },
              { role: "user", content: prompt },
            ],
          });

          const content = response.choices[0]?.message?.content || "[]";
          const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
          const suggestions = JSON.parse(contentStr.trim());
          
          return { suggestions: suggestions.slice(0, 3) };
        } catch (error) {
          console.error("Failed to generate suggestions:", error);
          return { suggestions: [] };
        }
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

  // Amazon Storefront
  storefront: router({
    getRecommendations: protectedProcedure.query(async ({ ctx }) => {
      // Get user's goals and habits
      const goals = await db.getUserGoals(ctx.user.id);
      const habits = await db.getUserHabits(ctx.user.id);
      const profile = await db.getUserProfile(ctx.user.id);
      
      // Get all products
      const allProducts = await db.getAllStorefrontProducts();
      
      // Extract user's categories and keywords
      const userCategories = new Set(goals.map(g => g.category));
      const userKeywords = new Set([
        ...goals.map(g => g.title.toLowerCase().split(' ')).flat(),
        ...habits.map(h => h.name.toLowerCase().split(' ')).flat(),
        ...(profile?.selectedCategories || []),
      ]);
      
      // Score and personalize products
      const scoredProducts = allProducts.map(product => {
        let score = 0;
        const matchedGoals: string[] = [];
        
        // Match by category
        if (userCategories.has(product.category)) {
          score += 10;
        }
        
        // Match by tags
        const productTags = product.tags || [];
        productTags.forEach(tag => {
          if (userKeywords.has(tag.toLowerCase())) {
            score += 5;
          }
        });
        
        // Find matching goals
        goals.forEach(goal => {
          if (goal.category === product.category) {
            matchedGoals.push(goal.title);
          }
        });
        
        return {
          ...product,
          personalized: score > 0,
          matchedGoals,
          score,
        };
      });
      
      // Sort by score (highest first)
      return scoredProducts.sort((a, b) => b.score - a.score);
    }),
    
    getCategories: protectedProcedure.query(async () => {
      const products = await db.getAllStorefrontProducts();
      const categorySet = new Set(products.map((p: any) => p.category));
      const categories = Array.from(categorySet);
      return categories;
    }),
  }),
});

export type AppRouter = typeof appRouter;
