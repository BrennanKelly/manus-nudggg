# Nudggg Project TODO

## Phase 1: Architecture & Planning
- [x] Initialize project with web-db-user scaffold
- [x] Create project roadmap and todo list

## Phase 2: Database Schema & Theme
- [x] Design and implement database schema for users, goals, habits, journals, nudges
- [x] Configure soft autumn color palette in theme
- [x] Set up global typography and spacing

## Phase 3: Authentication & Onboarding
- [x] Set up authentication flow with Manus OAuth
- [x] Create onboarding flow to collect user goals and preferences
- [x] Build user profile management

## Phase 4: Goals & Habits Management
- [x] Create goals CRUD operations (create, read, update, delete)
- [x] Create habits CRUD operations with frequency tracking
- [x] Build habit logging system with streak tracking
- [x] Create goals and habits dashboard view

## Phase 5: Journal Feature
- [x] Build journal entry creation and editing
- [x] Implement AI-powered reflection prompts
- [x] Generate AI insights on journal entries
- [x] Create journal history view with filtering
- [x] Add mood tracking to journal entries

## Phase 6: Nudge Engine & Notifications
- [x] Design nudge engine logic (time-based, behavior-based, goal-based)
- [x] Implement nudge generation with LLM
- [x] Create notification logging system
- [x] Build in-app notification feed
- [x] Set up scheduled nudge delivery system

## Phase 7: Dashboard & Insights
- [x] Create home dashboard with daily overview
- [x] Display active goals and upcoming habits
- [x] Show recent journal entries on home
- [x] Build weekly insights page with analytics
- [x] Generate AI-powered weekly reflections
- [x] Display habit streaks and progress charts

## Phase 8: UI Polish & Testing
- [x] Apply soft autumn color palette throughout
- [x] Ensure responsive design on all pages
- [x] Add loading states and error handling
- [x] Test all CRUD operations
- [x] Test AI generation features
- [x] Write vitest tests for critical features

## Phase 9: Delivery
- [x] Final testing and bug fixes
- [x] Create project checkpoint
- [x] Prepare documentation


## Phase 10: Retention Features (Tier 1)
- [x] Implement streak system with visual counter
- [x] Add streak milestones (7, 14, 30, 60, 100, 365 days)
- [x] Create streak freeze mechanism (1 per week)
- [x] Add longest streak ever tracking
- [ ] Implement comeback streak mechanic
- [ ] Build 2-minute daily check-in flow
- [ ] Add mood emoji selector to check-in
- [ ] Create one-habit-at-a-time logging
- [ ] Add micro-celebrations (confetti animations)
- [ ] Implement encouraging message rotation system

## Phase 11: Amazon Recommendations Feature
- [ ] Create Amazon recommendations tab/page
- [ ] Build AI system to analyze goals, habits, and journals
- [ ] Generate personalized product recommendations
- [ ] Integrate Amazon Product Advertising API
- [ ] Display product cards with images, titles, prices
- [ ] Add filtering by category (books, tools, equipment, etc.)
- [ ] Implement recommendation refresh based on progress

## Phase 12: Forgiveness & Onboarding Improvements
- [ ] Add "life happens" pause mode
- [ ] Implement comeback bonuses for returning users
- [ ] Remove negative language and red X's from UI
- [ ] Optimize onboarding to deliver value in <3 minutes
- [ ] Add immediate first win in onboarding
- [ ] Create celebration animation for onboarding completion


## Bug Fixes
- [x] Fix 404 error for favicon.ico
- [x] Fix 403 error for index.css

## Phase 13: Onboarding Redesign & Goal→Habit→Nudge Engine
- [x] Create "Why Nudggg exists" intro screen with exciting copy
- [x] Build category assessment with 7-10 checkboxes (multi-select)
- [x] Implement goal expansion for each selected category
- [x] Add "Why does this matter?" field for each goal
- [x] Create habit suggestion system based on goal/category
- [x] Build frequency selector (2x/wk, 3x/wk, 4x/wk, daily, custom)
- [x] Implement smart day-of-week scheduling with suggestions
- [x] Add time preference selector (morning/afternoon/evening)
- [x] Create "this week" quick-start scheduling
- [x] Auto-generate nudges/tasks from scheduled habits
- [x] Link habits to goals in database (goal_id foreign key)

## Phase 14: Amazon Storefront (Curated v1)
- [x] Create "Storefront" / "Gear" / "Tools" tab
- [x] Build curated product database with manual curation
- [x] Map products to categories, goals, and habits
- [x] Design product card UI (name, link, "why it helps" copy)
- [x] Add Amazon affiliate disclosure
- [ ] Create product bundles (e.g., "Strength Starter Kit")
- [x] Implement personalized filtering based on user's goals/habits
- [x] Add "because you said..." personalization copy
