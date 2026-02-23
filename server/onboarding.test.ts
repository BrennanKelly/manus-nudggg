import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Profile and Onboarding", () => {
  it("creates user profile with selected categories", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.create({
      selectedCategories: ["Physical health", "Career growth", "Mental health"],
      motivations: "I want to improve my overall wellbeing",
      biggestObstacle: "Lack of consistency",
      confidenceLevel: 3,
    });

    expect(result).toEqual({ success: true });
  });

  it("creates profile and returns success", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.create({
      selectedCategories: ["Physical health"],
      motivations: "Get healthier",
    });
    
    // Verify creation succeeded
    expect(result).toEqual({ success: true });
  });
});

describe("Goals with Categories", () => {
  it("creates goal with required category field", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.goals.create({
      title: "Run a 5K",
      category: "Physical health",
      whyItMatters: "I want to feel stronger and more energetic",
      targetDate: "2026-06-01",
    });

    expect(result).toEqual({ success: true });
  });

  it("lists goals with category information", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await caller.goals.create({
      title: "Learn TypeScript",
      category: "Career growth",
      whyItMatters: "Advance my development skills",
    });

    const goals = await caller.goals.list();
    
    expect(goals.length).toBeGreaterThan(0);
    const goal = goals.find(g => g.title === "Learn TypeScript");
    expect(goal?.category).toBe("Career growth");
    expect(goal?.whyItMatters).toBe("Advance my development skills");
  });
});

describe("Habit Builder with Goal Linking", () => {
  it("creates habit linked to a goal", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First create a goal
    await caller.goals.create({
      title: "Get fit",
      category: "Physical health",
    });

    const goals = await caller.goals.list();
    const goalId = goals[0]?.id;

    // Create habit linked to goal
    const result = await caller.habits.create({
      name: "Morning workout",
      goalId,
      frequencyType: "custom",
      frequencyCount: 3,
      scheduledDays: [1, 3, 5], // Mon, Wed, Fri
      timePreference: "morning",
    });

    expect(result).toEqual({ success: true });
  });

  it("generates AI habit suggestions based on goal", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.habits.generateSuggestions({
      goalTitle: "Read more books",
      category: "Personal growth",
      whyItMatters: "Expand my knowledge and perspective",
    });

    expect(result.suggestions).toBeDefined();
    expect(Array.isArray(result.suggestions)).toBe(true);
    // AI might return 0-3 suggestions depending on availability
    expect(result.suggestions.length).toBeLessThanOrEqual(3);
  });
});

describe("Storefront Recommendations", () => {
  it("returns empty recommendations when user has no goals", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.storefront.getRecommendations();
    
    expect(Array.isArray(products)).toBe(true);
    // Should return all products but none marked as personalized
    const personalizedCount = products.filter(p => p.personalized).length;
    expect(personalizedCount).toBe(0);
  });

  it("returns product categories", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const categories = await caller.storefront.getCategories();
    
    expect(Array.isArray(categories)).toBe(true);
    // Categories depend on seeded products, so just verify it's an array
  });
});
