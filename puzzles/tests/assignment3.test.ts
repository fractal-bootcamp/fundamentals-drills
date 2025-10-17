import { describe, it, expect } from "vitest";
import { processMessages } from "../problems/assignment3";

describe("processMessages", () => {
  it("should handle a simple conversation thread", () => {
    const result = processMessages({
      events: [
        { type: "send", id: "1", sender: "alice", text: "Hello!" },
        { type: "send", id: "2", sender: "bob", text: "Hi Alice!", replyTo: "1" },
        { type: "react", messageId: "1", user: "bob", emoji: "👋" },
      ],
    });

    expect(result.messages.length).toBe(2);
    expect(result.errors).toEqual([]);

    const msg1 = result.messages.find(m => m.id === "1");
    expect(msg1?.replies).toEqual(["2"]);
    expect(msg1?.reactions.length).toBe(1);
    expect(msg1?.reactions[0]).toEqual({ emoji: "👋", users: ["bob"], count: 1 });

    expect(result.threads.length).toBe(1);
    expect(result.threads[0].rootId).toBe("1");
    expect(result.threads[0].messageIds).toEqual(["1", "2"]);
  });

  it("should handle empty events", () => {
    const result = processMessages({ events: [] });

    expect(result.messages).toEqual([]);
    expect(result.threads).toEqual([]);
    expect(result.errors).toEqual([]);
  });

  it("should reject duplicate message IDs", () => {
    const result = processMessages({
      events: [
        { type: "send", id: "1", sender: "alice", text: "First" },
        { type: "send", id: "1", sender: "bob", text: "Duplicate" },
      ],
    });

    expect(result.messages.length).toBe(1);
    expect(result.messages[0].sender).toBe("alice");
    expect(result.errors.length).toBe(1);
    expect(result.errors[0]).toContain("already exists");
  });

  it("should reject reply to non-existent message", () => {
    const result = processMessages({
      events: [
        { type: "send", id: "1", sender: "alice", text: "Reply to nothing", replyTo: "999" },
      ],
    });

    expect(result.messages.length).toBe(0);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0]).toContain("non-existent");
  });

  it("should reject reply to deleted message", () => {
    const result = processMessages({
      events: [
        { type: "send", id: "1", sender: "alice", text: "Start" },
        { type: "send", id: "2", sender: "bob", text: "Middle", replyTo: "1" },
        { type: "delete", messageId: "2" },
        { type: "send", id: "3", sender: "carol", text: "End", replyTo: "2" },
      ],
    });

    expect(result.messages.length).toBe(2);
    const msg2 = result.messages.find(m => m.id === "2");
    expect(msg2?.deleted).toBe(true);
    expect(msg2?.text).toBe("[deleted]");

    expect(result.errors.length).toBe(1);
    expect(result.errors[0]).toContain("deleted message");
  });

  it("should handle message editing", () => {
    const result = processMessages({
      events: [
        { type: "send", id: "1", sender: "alice", text: "Original text" },
        { type: "edit", messageId: "1", newText: "Edited text" },
      ],
    });

    expect(result.messages.length).toBe(1);
    expect(result.messages[0].text).toBe("Edited text");
    expect(result.errors).toEqual([]);
  });

  it("should not edit non-existent message", () => {
    const result = processMessages({
      events: [
        { type: "edit", messageId: "999", newText: "Should fail" },
      ],
    });

    expect(result.messages.length).toBe(0);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0]).toContain("non-existent");
  });

  it("should not edit deleted message", () => {
    const result = processMessages({
      events: [
        { type: "send", id: "1", sender: "alice", text: "Original" },
        { type: "delete", messageId: "1" },
        { type: "edit", messageId: "1", newText: "Try to edit" },
      ],
    });

    const msg = result.messages[0];
    expect(msg.text).toBe("[deleted]");
    expect(msg.deleted).toBe(true);
  });

  it("should handle multiple reactions", () => {
    const result = processMessages({
      events: [
        { type: "send", id: "1", sender: "alice", text: "Hello" },
        { type: "react", messageId: "1", user: "bob", emoji: "👍" },
        { type: "react", messageId: "1", user: "carol", emoji: "👍" },
        { type: "react", messageId: "1", user: "bob", emoji: "❤️" },
      ],
    });

    const msg = result.messages[0];
    expect(msg.reactions.length).toBe(2);

    const thumbsUp = msg.reactions.find(r => r.emoji === "👍");
    expect(thumbsUp?.count).toBe(2);
    expect(thumbsUp?.users).toEqual(["bob", "carol"]);

    const heart = msg.reactions.find(r => r.emoji === "❤️");
    expect(heart?.count).toBe(1);
    expect(heart?.users).toEqual(["bob"]);
  });

  it("should not duplicate reactions from same user", () => {
    const result = processMessages({
      events: [
        { type: "send", id: "1", sender: "alice", text: "Hello" },
        { type: "react", messageId: "1", user: "bob", emoji: "👍" },
        { type: "react", messageId: "1", user: "bob", emoji: "👍" },
      ],
    });

    const msg = result.messages[0];
    expect(msg.reactions.length).toBe(1);
    expect(msg.reactions[0].count).toBe(1);
    expect(msg.reactions[0].users).toEqual(["bob"]);
  });

  it("should reject reaction to non-existent message", () => {
    const result = processMessages({
      events: [
        { type: "react", messageId: "999", user: "alice", emoji: "👍" },
      ],
    });

    expect(result.errors.length).toBe(1);
    expect(result.errors[0]).toContain("non-existent");
  });

  it("should handle deep nested threads", () => {
    const result = processMessages({
      events: [
        { type: "send", id: "1", sender: "alice", text: "Root" },
        { type: "send", id: "2", sender: "bob", text: "Reply 1", replyTo: "1" },
        { type: "send", id: "3", sender: "carol", text: "Reply 2", replyTo: "2" },
        { type: "send", id: "4", sender: "dave", text: "Reply 3", replyTo: "3" },
      ],
    });

    expect(result.threads.length).toBe(1);
    expect(result.threads[0].messageIds).toEqual(["1", "2", "3", "4"]);

    const msg1 = result.messages.find(m => m.id === "1");
    const msg2 = result.messages.find(m => m.id === "2");
    const msg3 = result.messages.find(m => m.id === "3");

    expect(msg1?.replies).toEqual(["2"]);
    expect(msg2?.replies).toEqual(["3"]);
    expect(msg3?.replies).toEqual(["4"]);
  });

  it("should handle multiple independent threads", () => {
    const result = processMessages({
      events: [
        { type: "send", id: "1", sender: "alice", text: "Thread 1" },
        { type: "send", id: "2", sender: "bob", text: "Thread 2" },
        { type: "send", id: "3", sender: "carol", text: "Reply to 1", replyTo: "1" },
        { type: "send", id: "4", sender: "dave", text: "Reply to 2", replyTo: "2" },
      ],
    });

    expect(result.threads.length).toBe(2);

    const thread1 = result.threads.find(t => t.rootId === "1");
    const thread2 = result.threads.find(t => t.rootId === "2");

    expect(thread1?.messageIds).toEqual(["1", "3"]);
    expect(thread2?.messageIds).toEqual(["2", "4"]);
  });

  it("should handle deletion of non-existent message", () => {
    const result = processMessages({
      events: [
        { type: "delete", messageId: "999" },
      ],
    });

    expect(result.errors.length).toBe(1);
    expect(result.errors[0]).toContain("non-existent");
  });

  it("should preserve thread structure when root is deleted", () => {
    const result = processMessages({
      events: [
        { type: "send", id: "1", sender: "alice", text: "Root" },
        { type: "send", id: "2", sender: "bob", text: "Reply", replyTo: "1" },
        { type: "delete", messageId: "1" },
      ],
    });

    const msg1 = result.messages.find(m => m.id === "1");
    expect(msg1?.deleted).toBe(true);
    expect(msg1?.replies).toEqual(["2"]);

    expect(result.threads[0].messageIds).toEqual(["1", "2"]);
  });

  it("should handle complex scenario with all operations", () => {
    const result = processMessages({
      events: [
        { type: "send", id: "1", sender: "alice", text: "Hello everyone!" },
        { type: "send", id: "2", sender: "bob", text: "Hi Alice!", replyTo: "1" },
        { type: "react", messageId: "1", user: "bob", emoji: "👋" },
        { type: "react", messageId: "1", user: "carol", emoji: "👋" },
        { type: "send", id: "3", sender: "carol", text: "Hey!", replyTo: "1" },
        { type: "edit", messageId: "2", newText: "Hi Alice! How are you?" },
        { type: "react", messageId: "2", user: "alice", emoji: "❤️" },
        { type: "send", id: "4", sender: "alice", text: "I'm good!", replyTo: "2" },
        { type: "delete", messageId: "3" },
      ],
    });

    expect(result.messages.length).toBe(4);
    expect(result.errors).toEqual([]);

    const msg1 = result.messages.find(m => m.id === "1");
    expect(msg1?.reactions[0].count).toBe(2);
    expect(msg1?.replies).toEqual(["2", "3"]);

    const msg2 = result.messages.find(m => m.id === "2");
    expect(msg2?.text).toBe("Hi Alice! How are you?");
    expect(msg2?.reactions.length).toBe(1);
    expect(msg2?.replies).toEqual(["4"]);

    const msg3 = result.messages.find(m => m.id === "3");
    expect(msg3?.deleted).toBe(true);

    expect(result.threads[0].messageIds).toEqual(["1", "2", "4", "3"]);
  });
});
