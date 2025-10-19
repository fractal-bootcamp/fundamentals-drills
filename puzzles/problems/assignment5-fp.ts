/**
 * Assignment 5 — Event Log Analyzer (Perfect for Functional Programming!)
 *
 * You are analyzing user activity logs from a web application. Each log entry
 * represents an event (login, page view, purchase, logout). You need to process
 * these events to generate analytics reports.
 
 * Input:
 *   {
 *     events: Array<{
 *       userId: string,
 *       type: "login" | "pageview" | "purchase" | "logout",
 *       timestamp: number,  // Unix timestamp (seconds)
 *       data?: {
 *         page?: string,      // For pageview events
 *         amount?: number,    // For purchase events (in cents)
 *         product?: string    // For purchase events
 *       }
 *     }>
 *   }
 *
 * Output:
 *   {
 *     totalUsers: number,                    // Unique users
 *     totalRevenue: number,                  // Sum of all purchases (in cents)
 *     averageSessionLength: number,          // Average seconds between login and logout
 *     topPages: Array<{ page: string, views: number }>,  // Top 3 most viewed pages
 *     userSummaries: Array<{
 *       userId: string,
 *       loginCount: number,
 *       purchaseCount: number,
 *       totalSpent: number,
 *       sessionDurations: number[]           // Array of session lengths
 *     }>
 *   }
 *
 * Rules:
 *   - A session is from login to the next logout for the same user
 *   - If a user logs in again without logging out, start a new session
 *   - Sessions without a logout are ignored for session length calculation
 *   - Top pages should be sorted by view count (descending), then alphabetically
 *   - Return top 3 pages (or fewer if less than 3 unique pages)
 *   - All calculations should be pure (no side effects)
 *
 * Example:
 *   events: [
 *     { userId: "alice", type: "login", timestamp: 1000 },
 *     { userId: "alice", type: "pageview", timestamp: 1010, data: { page: "home" } },
 *     { userId: "alice", type: "purchase", timestamp: 1020, data: { amount: 5000, product: "shirt" } },
 *     { userId: "alice", type: "logout", timestamp: 1100 },
 *     { userId: "bob", type: "login", timestamp: 2000 },
 *     { userId: "bob", type: "pageview", timestamp: 2010, data: { page: "home" } },
 *     { userId: "bob", type: "logout", timestamp: 2050 }
 *   ]
 *
 *   Output:
 *   {
 *     totalUsers: 2,
 *     totalRevenue: 5000,
 *     averageSessionLength: 75,  // (100 + 50) / 2
 *     topPages: [{ page: "home", views: 2 }],
 *     userSummaries: [
 *       { userId: "alice", loginCount: 1, purchaseCount: 1, totalSpent: 5000, sessionDurations: [100] },
 *       { userId: "bob", loginCount: 1, purchaseCount: 0, totalSpent: 0, sessionDurations: [50] }
 *     ]
 *   }
 */

// ============================================================================
// TYPES
// ============================================================================

type EventType = "login" | "pageview" | "purchase" | "logout";

type Event = {
  userId: string;
  type: EventType;
  timestamp: number;
  data?: {
    page?: string;
    amount?: number;
    product?: string;
  };
};

type UserSummary = {
  userId: string;
  loginCount: number;
  purchaseCount: number;
  totalSpent: number;
  sessionDurations: number[];
};

type PageStats = {
  page: string;
  views: number;
};

type AnalyticsReport = {
  totalUsers: number;
  totalRevenue: number;
  averageSessionLength: number;
  topPages: PageStats[];
  userSummaries: UserSummary[];
};

// ============================================================================
// FUNCTIONAL SOLUTION
// ============================================================================

/**
 * Pure helper functions (small, composable, testable)
 */

// Get unique users
const getUniqueUsers = (events: Event[]): string[] =>
  Array.from(new Set(events.map(e => e.userId)));

// Calculate total revenue
const calculateTotalRevenue = (events: Event[]): number =>
  events
    .filter(e => e.type === "purchase")
    .reduce((sum, e) => sum + (e.data?.amount || 0), 0);

// Count page views and return sorted top pages
const getTopPages = (events: Event[], limit: number = 3): PageStats[] => {
  const pageCounts = events
    .filter(e => e.type === "pageview" && e.data?.page)
    .reduce((acc, e) => {
      const page = e.data!.page!;
      return { ...acc, [page]: (acc[page] || 0) + 1 };
    }, {} as Record<string, number>);

  return Object.entries(pageCounts)
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => {
      if (b.views !== a.views) return b.views - a.views;
      return a.page.localeCompare(b.page);
    })
    .slice(0, limit);
};

// Calculate session durations for a user
const calculateSessionDurations = (userEvents: Event[]): number[] => {
  const sessions = userEvents.reduce(
    (acc, event) => {
      if (event.type === "login") {
        // Start new session
        return {
          ...acc,
          currentLoginTime: event.timestamp,
          sessions: acc.currentLoginTime !== null
            ? [...acc.sessions, { start: acc.currentLoginTime, end: null }]
            : acc.sessions
        };
      }

      if (event.type === "logout" && acc.currentLoginTime !== null) {
        // End current session
        return {
          ...acc,
          sessions: [
            ...acc.sessions,
            { start: acc.currentLoginTime, end: event.timestamp }
          ],
          currentLoginTime: null
        };
      }

      return acc;
    },
    { currentLoginTime: null as number | null, sessions: [] as Array<{ start: number; end: number | null }> }
  );

  return sessions.sessions
    .filter(s => s.end !== null)
    .map(s => s.end! - s.start);
};

// Create user summary
const createUserSummary = (userId: string, events: Event[]): UserSummary => {
  const userEvents = events.filter(e => e.userId === userId);

  return {
    userId,
    loginCount: userEvents.filter(e => e.type === "login").length,
    purchaseCount: userEvents.filter(e => e.type === "purchase").length,
    totalSpent: userEvents
      .filter(e => e.type === "purchase")
      .reduce((sum, e) => sum + (e.data?.amount || 0), 0),
    sessionDurations: calculateSessionDurations(userEvents)
  };
};

// Calculate average session length
const calculateAverageSessionLength = (userSummaries: UserSummary[]): number => {
  const allDurations = userSummaries.flatMap(u => u.sessionDurations);

  if (allDurations.length === 0) return 0;

  return allDurations.reduce((sum, d) => sum + d, 0) / allDurations.length;
};

// Main function: compose all the pieces
export const analyzeEventLog = (input: { events: Event[] }): AnalyticsReport => {
  const { events } = input;

  // Get unique users
  const uniqueUsers = getUniqueUsers(events);

  // Create user summaries (one per user)
  const userSummaries = uniqueUsers.map(userId =>
    createUserSummary(userId, events)
  );

  // Compose the final report
  return {
    totalUsers: uniqueUsers.length,
    totalRevenue: calculateTotalRevenue(events),
    averageSessionLength: calculateAverageSessionLength(userSummaries),
    topPages: getTopPages(events),
    userSummaries
  };
};

// ============================================================================
// WHY FUNCTIONAL PROGRAMMING SHINES HERE
// ============================================================================

/**
 * BENEFITS OF FP APPROACH FOR THIS PROBLEM:
 *
 * 1. COMPOSABILITY
 *    Each function does ONE thing and can be tested independently:
 *    - getUniqueUsers()
 *    - calculateTotalRevenue()
 *    - getTopPages()
 *    - etc.
 *
 * 2. DECLARATIVE
 *    Code reads like the specification:
 *    "Get unique users, calculate revenue, get top pages..."
 *    vs imperative: "Loop through events, if user not in set, add to set..."
 *
 * 3. IMMUTABILITY
 *    No arrays or objects are mutated - easier to reason about
 *    No bugs from accidental mutation
 *
 * 4. REUSABILITY
 *    Want top 5 pages instead of top 3? Just change one parameter
 *    Want to add a new metric? Add a new pure function
 *
 * 5. TESTABILITY
 *    Each function can be tested with simple inputs/outputs
 *    No need to mock state or side effects
 *
 * 6. PIPELINE OPERATIONS
 *    The data flows through transformations:
 *    events → filter → map → reduce → result
 *
 * 7. PARALLEL-FRIENDLY
 *    Since there's no shared mutable state, operations could
 *    theoretically be parallelized
 *
 * 8. SELF-DOCUMENTING
 *    Function names describe what they do
 *    Easy to understand the data flow
 */

// ============================================================================
// IMPERATIVE VS FUNCTIONAL COMPARISON
// ============================================================================

/**
 * IMPERATIVE VERSION (for comparison)
 */
export const analyzeEventLogImperative = (input: { events: Event[] }): AnalyticsReport => {
  const events = input.events;

  // Calculate unique users
  const userSet = new Set<string>();
  for (let i = 0; i < events.length; i++) {
    userSet.add(events[i].userId);
  }
  const totalUsers = userSet.size;

  // Calculate total revenue
  let totalRevenue = 0;
  for (let i = 0; i < events.length; i++) {
    if (events[i].type === "purchase") {
      totalRevenue += events[i].data?.amount || 0;
    }
  }

  // Count page views
  const pageCounts: Record<string, number> = {};
  for (let i = 0; i < events.length; i++) {
    if (events[i].type === "pageview" && events[i].data?.page) {
      const page = events[i].data!.page!;
      pageCounts[page] = (pageCounts[page] || 0) + 1;
    }
  }

  // Sort pages
  const topPages: PageStats[] = [];
  for (const page in pageCounts) {
    topPages.push({ page, views: pageCounts[page] });
  }
  topPages.sort((a, b) => {
    if (b.views !== a.views) return b.views - a.views;
    return a.page.localeCompare(b.page);
  });
  topPages.splice(3); // Keep only top 3

  // Create user summaries
  const userSummaries: UserSummary[] = [];
  const users = Array.from(userSet);

  for (let u = 0; u < users.length; u++) {
    const userId = users[u];
    const userEvents = [];

    for (let i = 0; i < events.length; i++) {
      if (events[i].userId === userId) {
        userEvents.push(events[i]);
      }
    }

    let loginCount = 0;
    let purchaseCount = 0;
    let totalSpent = 0;

    for (let i = 0; i < userEvents.length; i++) {
      if (userEvents[i].type === "login") loginCount++;
      if (userEvents[i].type === "purchase") {
        purchaseCount++;
        totalSpent += userEvents[i].data?.amount || 0;
      }
    }

    // Calculate session durations
    const sessionDurations: number[] = [];
    let currentLoginTime: number | null = null;

    for (let i = 0; i < userEvents.length; i++) {
      if (userEvents[i].type === "login") {
        currentLoginTime = userEvents[i].timestamp;
      } else if (userEvents[i].type === "logout" && currentLoginTime !== null) {
        sessionDurations.push(userEvents[i].timestamp - currentLoginTime);
        currentLoginTime = null;
      }
    }

    userSummaries.push({
      userId,
      loginCount,
      purchaseCount,
      totalSpent,
      sessionDurations
    });
  }

  // Calculate average session length
  let totalDuration = 0;
  let sessionCount = 0;
  for (let i = 0; i < userSummaries.length; i++) {
    for (let j = 0; j < userSummaries[i].sessionDurations.length; j++) {
      totalDuration += userSummaries[i].sessionDurations[j];
      sessionCount++;
    }
  }
  const averageSessionLength = sessionCount === 0 ? 0 : totalDuration / sessionCount;

  return {
    totalUsers,
    totalRevenue,
    averageSessionLength,
    topPages,
    userSummaries
  };
};

/**
 * COMPARISON:
 *
 * Imperative version:
 * - 100+ lines
 * - Many nested loops
 * - Variables scattered throughout
 * - Hard to extract and test individual pieces
 * - Easy to introduce bugs (wrong index, forgot to reset variable, etc.)
 *
 * Functional version:
 * - 60 lines (main logic)
 * - Clear data flow
 * - Each function independently testable
 * - No mutable state
 * - Easy to add new features
 */
