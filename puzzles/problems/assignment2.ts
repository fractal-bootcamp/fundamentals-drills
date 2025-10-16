// @ts-nocheck
/**
 * Programming Puzzle — Text Message Thread Organizer
 *
 * You are building a text message conversation viewer that groups messages into threads.
 * Messages can be replies to other messages, forming tree-like conversation threads.
 * Your task is to organize a flat list of messages into structured conversation threads
 * and provide useful analytics about the conversations.
 *
 * Input:
 *   {
 *     messages: Array<Message>
 *   }
 *   where Message = {
 *     id: string;           // unique message identifier
 *     author: string;       // who sent the message
 *     text: string;         // message content
 *     timestamp: number;    // unix timestamp in seconds
 *     replyTo?: string;     // optional id of the message this is replying to
 *   }
 *
 * Output:
 *   {
 *     threads: Array<Thread>;
 *     analytics: {
 *       totalMessages: number;
 *       totalThreads: number;
 *       longestThread: number;        // max depth of any thread
 *       mostActiveAuthor: string;     // author with most messages (first alphabetically if tie)
 *       orphanedMessages: number;     // messages that reply to non-existent messages
 *     }
 *   }
 *   where Thread = {
 *     rootMessage: Message;
 *     replies: Array<Thread>;  // nested replies (recursive structure)
 *     depth: number;           // 0 for root, 1 for direct reply, etc.
 *     messageCount: number;    // total messages in this thread (including all nested replies)
 *   }
 *
 * Rules & Edge Cases:
 *   - A message with no replyTo is a root message (starts a new thread)
 *   - A message with replyTo that doesn't exist in the input is an "orphaned message"
 *     and should be treated as a root message for its own thread
 *   - Messages within a thread should be sorted by timestamp (oldest first)
 *   - Root threads should be sorted by their root message timestamp (oldest first)
 *   - depth is calculated from the root: root=0, direct reply=1, reply to reply=2, etc.
 *   - messageCount includes the current message plus all nested replies recursively
 *   - If no messages exist, return empty arrays and zeros (except mostActiveAuthor should be "")
 *   - Duplicate message IDs: keep only the first occurrence
 *   - Messages can form arbitrarily deep nesting (limited only by input)
 *   - All comparisons are case-sensitive
 *
 * Examples:
 *   Example A - Simple linear thread:
 *     messages=[
 *       {id:"1", author:"alice", text:"Hello", timestamp:100},
 *       {id:"2", author:"bob", text:"Hi", timestamp:200, replyTo:"1"}
 *     ]
 *     => 1 thread with depth 1, messageCount 2
 *
 *   Example B - Multiple threads with orphans:
 *     messages=[
 *       {id:"1", author:"alice", text:"A", timestamp:100},
 *       {id:"2", author:"bob", text:"B", timestamp:150, replyTo:"999"},  // orphan
 *       {id:"3", author:"alice", text:"C", timestamp:200, replyTo:"1"}
 *     ]
 *     => 2 threads (one starting with id:1, one orphaned thread starting with id:2)
 *     => mostActiveAuthor="alice" (2 messages vs bob's 1)
 *
 *   Example C - Branching conversation:
 *     messages=[
 *       {id:"1", author:"alice", text:"Question?", timestamp:100},
 *       {id:"2", author:"bob", text:"Answer A", timestamp:200, replyTo:"1"},
 *       {id:"3", author:"carol", text:"Answer B", timestamp:250, replyTo:"1"}
 *     ]
 *     => 1 thread with 2 direct replies, longestThread=1, messageCount=3
 */

export function organizeMessageThreads(input) {
  if (!input || !Array.isArray(input.messages)) {
    return {
      threads: [],
      analytics: {
        totalMessages: 0,
        totalThreads: 0,
        longestThread: 0,
        mostActiveAuthor: "",
        orphanedMessages: 0
      }
    };
  }

  // Remove duplicate message IDs (keep first occurrence)
  const seenIds = new Set();
  const uniqueMessages = input.messages.filter(msg => {
    if (seenIds.has(msg.id)) {
      return false;
    }
    seenIds.add(msg.id);
    return true;
  });

  // Build a map of message ID to message for quick lookup
  const messageMap = new Map();
  uniqueMessages.forEach(msg => {
    messageMap.set(msg.id, msg);
  });

  // Identify orphaned messages and root messages
  const orphanedMessageIds = new Set();
  const rootMessages = [];

  uniqueMessages.forEach(msg => {
    if (!msg.replyTo) {
      // No replyTo means it's a root message
      rootMessages.push(msg);
    } else if (!messageMap.has(msg.replyTo)) {
      // replyTo points to non-existent message - orphaned
      orphanedMessageIds.add(msg.id);
      rootMessages.push(msg);
    }
  });

  // Build a map of parent ID to array of child messages
  const childrenMap = new Map();
  uniqueMessages.forEach(msg => {
    if (msg.replyTo && !orphanedMessageIds.has(msg.id) && messageMap.has(msg.replyTo)) {
      if (!childrenMap.has(msg.replyTo)) {
        childrenMap.set(msg.replyTo, []);
      }
      childrenMap.get(msg.replyTo).push(msg);
    }
  });

  // Sort children by timestamp for each parent
  for (const children of childrenMap.values()) {
    children.sort((a, b) => a.timestamp - b.timestamp);
  }

  // Recursive function to build a thread structure
  function buildThread(message, currentDepth) {
    const children = childrenMap.get(message.id) || [];
    const replies = children.map(child => buildThread(child, currentDepth + 1));

    // Calculate total message count (this message + all nested replies)
    const messageCount = 1 + replies.reduce((sum, reply) => sum + reply.messageCount, 0);

    return {
      rootMessage: message,
      replies: replies,
      depth: currentDepth,
      messageCount: messageCount
    };
  }

  // Build all threads
  rootMessages.sort((a, b) => a.timestamp - b.timestamp);
  const threads = rootMessages.map(root => buildThread(root, 0));

  // Calculate analytics
  const totalMessages = uniqueMessages.length;
  const totalThreads = threads.length;

  // Find longest thread depth
  let longestThread = 0;
  function findMaxDepth(thread) {
    let maxDepth = thread.depth;
    for (const reply of thread.replies) {
      maxDepth = Math.max(maxDepth, findMaxDepth(reply));
    }
    return maxDepth;
  }
  for (const thread of threads) {
    longestThread = Math.max(longestThread, findMaxDepth(thread));
  }

  // Find most active author
  const authorCounts = new Map();
  uniqueMessages.forEach(msg => {
    authorCounts.set(msg.author, (authorCounts.get(msg.author) || 0) + 1);
  });

  let mostActiveAuthor = "";
  let maxCount = 0;
  for (const [author, count] of authorCounts.entries()) {
    if (count > maxCount || (count === maxCount && author < mostActiveAuthor)) {
      mostActiveAuthor = author;
      maxCount = count;
    }
  }

  const orphanedMessages = orphanedMessageIds.size;

  return {
    threads,
    analytics: {
      totalMessages,
      totalThreads,
      longestThread,
      mostActiveAuthor,
      orphanedMessages
    }
  };
}
