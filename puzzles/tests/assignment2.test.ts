import { describe, it, expect } from "vitest";
import { organizeMessageThreads } from "../problems/assignment2";

describe("organizeMessageThreads", () => {
  // Example A - Simple linear thread
  it("should handle simple linear thread from example A", () => {
    const input = {
      messages: [
        { id: "1", author: "alice", text: "Hello", timestamp: 100 },
        { id: "2", author: "bob", text: "Hi", timestamp: 200, replyTo: "1" }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.threads).toHaveLength(1);
    expect(result.threads[0].rootMessage.id).toBe("1");
    expect(result.threads[0].depth).toBe(0);
    expect(result.threads[0].messageCount).toBe(2);
    expect(result.threads[0].replies).toHaveLength(1);
    expect(result.threads[0].replies[0].rootMessage.id).toBe("2");
    expect(result.threads[0].replies[0].depth).toBe(1);

    expect(result.analytics.totalMessages).toBe(2);
    expect(result.analytics.totalThreads).toBe(1);
    expect(result.analytics.longestThread).toBe(1);
    expect(result.analytics.orphanedMessages).toBe(0);
  });

  // Example B - Multiple threads with orphans
  it("should handle multiple threads with orphaned messages from example B", () => {
    const input = {
      messages: [
        { id: "1", author: "alice", text: "A", timestamp: 100 },
        { id: "2", author: "bob", text: "B", timestamp: 150, replyTo: "999" },
        { id: "3", author: "alice", text: "C", timestamp: 200, replyTo: "1" }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.threads).toHaveLength(2);
    expect(result.threads[0].rootMessage.id).toBe("1");
    expect(result.threads[1].rootMessage.id).toBe("2");
    expect(result.analytics.totalMessages).toBe(3);
    expect(result.analytics.totalThreads).toBe(2);
    expect(result.analytics.mostActiveAuthor).toBe("alice");
    expect(result.analytics.orphanedMessages).toBe(1);
  });

  // Example C - Branching conversation
  it("should handle branching conversation from example C", () => {
    const input = {
      messages: [
        { id: "1", author: "alice", text: "Question?", timestamp: 100 },
        { id: "2", author: "bob", text: "Answer A", timestamp: 200, replyTo: "1" },
        { id: "3", author: "carol", text: "Answer B", timestamp: 250, replyTo: "1" }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.threads).toHaveLength(1);
    expect(result.threads[0].replies).toHaveLength(2);
    expect(result.threads[0].messageCount).toBe(3);
    expect(result.analytics.longestThread).toBe(1);
  });

  // Edge case - Empty input
  it("should handle empty messages array", () => {
    const input = { messages: [] };

    const result = organizeMessageThreads(input);

    expect(result.threads).toEqual([]);
    expect(result.analytics.totalMessages).toBe(0);
    expect(result.analytics.totalThreads).toBe(0);
    expect(result.analytics.longestThread).toBe(0);
    expect(result.analytics.mostActiveAuthor).toBe("");
    expect(result.analytics.orphanedMessages).toBe(0);
  });

  // Edge case - Null or malformed input
  it("should handle null input gracefully", () => {
    const result = organizeMessageThreads(null);

    expect(result.threads).toEqual([]);
    expect(result.analytics.totalMessages).toBe(0);
    expect(result.analytics.mostActiveAuthor).toBe("");
  });

  it("should handle missing messages array", () => {
    const result = organizeMessageThreads({});

    expect(result.threads).toEqual([]);
    expect(result.analytics.totalMessages).toBe(0);
  });

  // Deep nesting
  it("should handle deeply nested thread", () => {
    const input = {
      messages: [
        { id: "1", author: "alice", text: "Root", timestamp: 100 },
        { id: "2", author: "bob", text: "Reply 1", timestamp: 200, replyTo: "1" },
        { id: "3", author: "carol", text: "Reply 2", timestamp: 300, replyTo: "2" },
        { id: "4", author: "dave", text: "Reply 3", timestamp: 400, replyTo: "3" },
        { id: "5", author: "eve", text: "Reply 4", timestamp: 500, replyTo: "4" }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.threads).toHaveLength(1);
    expect(result.threads[0].messageCount).toBe(5);
    expect(result.analytics.longestThread).toBe(4);
    expect(result.analytics.totalMessages).toBe(5);
  });

  // Multiple root threads
  it("should handle multiple independent root threads", () => {
    const input = {
      messages: [
        { id: "1", author: "alice", text: "Thread 1", timestamp: 100 },
        { id: "2", author: "bob", text: "Thread 2", timestamp: 150 },
        { id: "3", author: "carol", text: "Thread 3", timestamp: 200 }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.threads).toHaveLength(3);
    expect(result.analytics.totalThreads).toBe(3);
    expect(result.analytics.longestThread).toBe(0);
  });

  // Thread ordering by timestamp
  it("should order root threads by timestamp (oldest first)", () => {
    const input = {
      messages: [
        { id: "3", author: "carol", text: "C", timestamp: 300 },
        { id: "1", author: "alice", text: "A", timestamp: 100 },
        { id: "2", author: "bob", text: "B", timestamp: 200 }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.threads[0].rootMessage.id).toBe("1");
    expect(result.threads[1].rootMessage.id).toBe("2");
    expect(result.threads[2].rootMessage.id).toBe("3");
  });

  // Reply ordering by timestamp
  it("should order replies by timestamp (oldest first)", () => {
    const input = {
      messages: [
        { id: "1", author: "alice", text: "Root", timestamp: 100 },
        { id: "4", author: "dave", text: "Reply 3", timestamp: 400, replyTo: "1" },
        { id: "2", author: "bob", text: "Reply 1", timestamp: 200, replyTo: "1" },
        { id: "3", author: "carol", text: "Reply 2", timestamp: 300, replyTo: "1" }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.threads[0].replies[0].rootMessage.id).toBe("2");
    expect(result.threads[0].replies[1].rootMessage.id).toBe("3");
    expect(result.threads[0].replies[2].rootMessage.id).toBe("4");
  });

  // Duplicate message IDs
  it("should keep only first occurrence of duplicate message IDs", () => {
    const input = {
      messages: [
        { id: "1", author: "alice", text: "First", timestamp: 100 },
        { id: "1", author: "bob", text: "Duplicate", timestamp: 200 },
        { id: "2", author: "carol", text: "Unique", timestamp: 300 }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.analytics.totalMessages).toBe(2);
    expect(result.threads[0].rootMessage.author).toBe("alice");
    expect(result.threads[0].rootMessage.text).toBe("First");
  });

  // Most active author with tie (alphabetically first)
  it("should resolve most active author ties alphabetically", () => {
    const input = {
      messages: [
        { id: "1", author: "zelda", text: "A", timestamp: 100 },
        { id: "2", author: "alice", text: "B", timestamp: 200 },
        { id: "3", author: "zelda", text: "C", timestamp: 300 },
        { id: "4", author: "alice", text: "D", timestamp: 400 }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.analytics.mostActiveAuthor).toBe("alice");
  });

  // Most active author with clear winner
  it("should identify most active author correctly", () => {
    const input = {
      messages: [
        { id: "1", author: "alice", text: "A", timestamp: 100 },
        { id: "2", author: "bob", text: "B", timestamp: 200 },
        { id: "3", author: "alice", text: "C", timestamp: 300 },
        { id: "4", author: "alice", text: "D", timestamp: 400 }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.analytics.mostActiveAuthor).toBe("alice");
  });

  // Complex tree with multiple branches at different levels
  it("should handle complex branching at multiple levels", () => {
    const input = {
      messages: [
        { id: "1", author: "alice", text: "Root", timestamp: 100 },
        { id: "2", author: "bob", text: "Reply 1", timestamp: 200, replyTo: "1" },
        { id: "3", author: "carol", text: "Reply 2", timestamp: 250, replyTo: "1" },
        { id: "4", author: "dave", text: "Reply to Reply 1", timestamp: 300, replyTo: "2" },
        { id: "5", author: "eve", text: "Another reply to Reply 1", timestamp: 350, replyTo: "2" },
        { id: "6", author: "frank", text: "Reply to Reply 2", timestamp: 400, replyTo: "3" }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.threads).toHaveLength(1);
    expect(result.threads[0].messageCount).toBe(6);
    expect(result.threads[0].replies).toHaveLength(2);
    expect(result.threads[0].replies[0].replies).toHaveLength(2);
    expect(result.threads[0].replies[1].replies).toHaveLength(1);
    expect(result.analytics.longestThread).toBe(2);
  });

  // Single message (root only)
  it("should handle single message with no replies", () => {
    const input = {
      messages: [
        { id: "1", author: "alice", text: "Lonely message", timestamp: 100 }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.threads).toHaveLength(1);
    expect(result.threads[0].messageCount).toBe(1);
    expect(result.threads[0].replies).toEqual([]);
    expect(result.analytics.longestThread).toBe(0);
    expect(result.analytics.mostActiveAuthor).toBe("alice");
  });

  // All orphaned messages
  it("should treat all orphaned messages as separate threads", () => {
    const input = {
      messages: [
        { id: "1", author: "alice", text: "A", timestamp: 100, replyTo: "999" },
        { id: "2", author: "bob", text: "B", timestamp: 200, replyTo: "998" },
        { id: "3", author: "carol", text: "C", timestamp: 300, replyTo: "997" }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.threads).toHaveLength(3);
    expect(result.analytics.orphanedMessages).toBe(3);
    expect(result.analytics.longestThread).toBe(0);
  });

  // Mixed orphaned and valid threads
  it("should handle mixture of valid threads and orphaned messages", () => {
    const input = {
      messages: [
        { id: "1", author: "alice", text: "Valid root", timestamp: 100 },
        { id: "2", author: "bob", text: "Orphan", timestamp: 150, replyTo: "999" },
        { id: "3", author: "carol", text: "Valid reply", timestamp: 200, replyTo: "1" },
        { id: "4", author: "dave", text: "Another root", timestamp: 250 }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.threads).toHaveLength(3);
    expect(result.analytics.orphanedMessages).toBe(1);
    expect(result.analytics.totalThreads).toBe(3);
  });

  // Verify depth calculation at multiple levels
  it("should calculate depth correctly at all levels", () => {
    const input = {
      messages: [
        { id: "1", author: "alice", text: "Root", timestamp: 100 },
        { id: "2", author: "bob", text: "Level 1", timestamp: 200, replyTo: "1" },
        { id: "3", author: "carol", text: "Level 2", timestamp: 300, replyTo: "2" }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.threads[0].depth).toBe(0);
    expect(result.threads[0].replies[0].depth).toBe(1);
    expect(result.threads[0].replies[0].replies[0].depth).toBe(2);
  });

  // Verify messageCount with complex nesting
  it("should calculate messageCount correctly with complex nesting", () => {
    const input = {
      messages: [
        { id: "1", author: "alice", text: "Root", timestamp: 100 },
        { id: "2", author: "bob", text: "Branch 1", timestamp: 200, replyTo: "1" },
        { id: "3", author: "carol", text: "Branch 2", timestamp: 250, replyTo: "1" },
        { id: "4", author: "dave", text: "Sub-branch", timestamp: 300, replyTo: "2" }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.threads[0].messageCount).toBe(4); // 1 root + 2 direct + 1 nested
    expect(result.threads[0].replies[0].messageCount).toBe(2); // branch 1 + sub-branch
    expect(result.threads[0].replies[1].messageCount).toBe(1); // branch 2 only
  });

  // Case sensitivity in author names
  it("should treat author names as case-sensitive", () => {
    const input = {
      messages: [
        { id: "1", author: "Alice", text: "A", timestamp: 100 },
        { id: "2", author: "alice", text: "B", timestamp: 200 },
        { id: "3", author: "ALICE", text: "C", timestamp: 300 }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.analytics.totalMessages).toBe(3);
    // All three should be counted as different authors
    expect(result.analytics.mostActiveAuthor).toBe("ALICE"); // First alphabetically with same count
  });

  // Real-world scenario: typical conversation
  it("should handle realistic conversation scenario", () => {
    const input = {
      messages: [
        { id: "msg1", author: "alice", text: "Anyone free for lunch?", timestamp: 1000 },
        { id: "msg2", author: "bob", text: "I am!", timestamp: 1100, replyTo: "msg1" },
        { id: "msg3", author: "carol", text: "Me too", timestamp: 1150, replyTo: "msg1" },
        { id: "msg4", author: "alice", text: "Great! Where should we go?", timestamp: 1200, replyTo: "msg1" },
        { id: "msg5", author: "bob", text: "How about pizza?", timestamp: 1250, replyTo: "msg4" },
        { id: "msg6", author: "carol", text: "Sounds good", timestamp: 1300, replyTo: "msg5" },
        { id: "msg7", author: "dave", text: "Hey, what's the meeting time tomorrow?", timestamp: 1400 },
        { id: "msg8", author: "alice", text: "10 AM", timestamp: 1450, replyTo: "msg7" }
      ]
    };

    const result = organizeMessageThreads(input);

    expect(result.threads).toHaveLength(2);
    expect(result.analytics.totalMessages).toBe(8);
    expect(result.analytics.totalThreads).toBe(2);
    expect(result.analytics.mostActiveAuthor).toBe("alice");
    expect(result.analytics.longestThread).toBe(3); // msg1 -> msg4 -> msg5 -> msg6
    expect(result.analytics.orphanedMessages).toBe(0);
  });
});
