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

type Message = {
  id: string;           // unique message identifier
  author: string;       // who sent the message
  text: string;         // message content
  timestamp: number;    // unix timestamp in seconds
  replyTo?: string;     // optional id of the message this is replying to
}

type Thread = {
  rootMessage: Message;
  replies: Array<Thread>;  // nested replies (recursive structure)
  depth: number;           // 0 for root, 1 for direct reply, etc.
  messageCount: number;    // total messages in this thread (including all nested replies)
}

type Analytics = {
  totalMessages: number;
  totalThreads: number;
  longestThread: number;        // max depth of any thread
  mostActiveAuthor: string;     // author with most messages (first alphabetically if tie)
  orphanedMessages: number;     // messages that reply to non-existent messages
}

type Input = { messages: Array<Message> }
type Output = { threads: Array<Thread>; analytics: Analytics }

// (0948) wow, kinda crazy that this was made from scratch. what's important to start here?
// (0951) let's spend 10 minutes porting the types and logging to console. 
// (1001) alright now let's structure our data. looks like threading is the key abstraction.
export function organizeMessageThreads(input: Input): Output {
  // console.log(input.messages)
  // array of 1d objects to tree structure: root and nodes, recursion...
  // let's start with a base case, but let's structure out our initial output
  // (1022) calculate longestThread and mostActiveAuthor at the end, own fn's
  // const output: Output = {
  //   threads: new Array(),
  //   analytics: {
  //     totalMessages: 0,
  //     totalThreads: 0,
  //     longestThread: 0,
  //     mostActiveAuthor: '',
  //     orphanedMessages: 0
  //   }
  // }
  // (1232) pre-processing with lookup maps,
  const idToMessage = new Map<string, Message>()
  const rootIdToReplies = new Map<string, Array<Message>>() // (1256) oh deal with msgs first!
  let maxDepth = 0 // (1600) imma be cheeky and just set maxDepth as threads are building
  for (let message of input.messages) {
    idToMessage.set(message.id, message)
    if (message.replyTo === undefined) {
      rootIdToReplies.set(message.id, [])
    } else if (message.replyTo) {
      if (!rootIdToReplies.has(message.replyTo)) {
        rootIdToReplies.set(message.replyTo, [message])
      } else if (rootIdToReplies.has(message.replyTo)) {
        rootIdToReplies.get(message.replyTo)?.push(message)
      }
    }
  }
  console.log('idToMessage', idToMessage)
  console.log('rootToReplies', rootIdToReplies)

  function buildThread(message: Message, depth: number): Thread {
    if (rootIdToReplies.has(message.id)) {
      const replies = rootIdToReplies
        .get(message.id)
        .map(reply => buildThread(reply, depth + 1))
      const count = replies
        .map(reply => reply.messageCount)
        .reduce((a, c) => a + c, 0)
      console.log(count)
      return {
        rootMessage: message,
        replies: replies,
        depth: depth,
        messageCount: count
      }
    } else {
      if (depth > maxDepth) { maxDepth = depth }
      return {
        rootMessage: message,
        replies: [],
        depth: depth,
        messageCount: 1
      }
    }
  }

  const rootMessages = input.messages.filter(message => message.replyTo === undefined)
  const threads = rootMessages.map(root => buildThread(root, 0))

  threads.map(thread => console.log(thread))
  return {
    threads: threads,
    analytics: {
      totalMessages: input.messages.length(),
      totalThreads: threads.length(),
      longestThread: maxDepth,
      mostActiveAuthor: '',
      orphanedMessages: 0 // implement pls.
    }
  }
}

const input = {
  messages: [
    { id: "1", author: "alice", text: "Hello", timestamp: 100 },
    { id: "2", author: "bob", text: "Hi", timestamp: 200, replyTo: "1" }
  ]
};

organizeMessageThreads(input);

// function iterativeThreadApproach() {
//   for (let message of input.messages) {
//     idToMessage.set(message.id, message)
//     if (message.replyTo === undefined) {
//       const newThread: Thread = {
//         rootMessage: message,
//         replies: new Array(),
//         depth: 0,
//         messageCount: 1
//       }
//       output.threads.push(newThread)
//       output.analytics.totalMessages += 1
//       output.analytics.totalThreads += 1
//     } else {
//       const newReply: Thread = {
//         rootMessage: message,
//         replies: new Array(),
//         depth: 1,
//         messageCount: 1
//       }
//       const root = output.threads.find((thread) => thread.rootMessage.id == message.id)
//       root?.replies.push(newReply)
//       root?.messageCount += 1
//       console.log('new output:', output)
//     }
//   }
// }
