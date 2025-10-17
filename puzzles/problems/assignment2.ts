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

type Thread = {
  rootMessage: Message;
  replies: Array<Thread>;  // nested replies (recursive structure)
  depth: number;           // 0 for root, 1 for direct reply, etc.
  messageCount: number;    // total messages in this thread (including all nested replies)

}

function messageWithID(id: string, threads: Thread[]) {
  if (threads != []) {


    if (threads.find((t) => t.rootMessage.id === id)) {
      return true

    } else {

      for (let thread of threads) {
        if (thread.replies != []) {
          messageWithID(id, thread.replies)
        }
      }
    }
  }
  return false


}

function addToReplies(replyTo: string, threads: Thread[], message: Message, totalMessages: number) {
  for (let thread of threads) {
    if (thread.rootMessage.id === message.replyTo) {

      thread.replies.push({ rootMessage: message, replies: [], depth: 0, messageCount: 1 })
      totalMessages += 1


      return true

    } else {
      addToReplies(replyTo, thread.replies, message, totalMessages)

    }
  }

  return false




}




function updateAuthors(authors: any[][], authorName: string) {

  for (let author: any[] of authors) {
    if (author[0] === authorName) {
      author[1] += 1
      return
    }




  }



  authors.push([authorName, 1])



}





export function organizeMessageThreads(input) {
  console.log("inputs", input)

  let authors: any[][] = []
  let threads: Thread[] = []
  let totalMessages: number = 0;
  let totalThreads: number = 0;
  let longestThread: number = 0;        // max depth of any thread
  let mostActiveAuthor: string = 0;     // author with most messages (first alphabetically if tie)
  let orphanedMessages: number = 0;     // messages that reply to non-existent messages



  for (let message of input.messages) {
    if (!messageWithID(message.id, threads)) {
      updateAuthors(authors, message.author)

      if (!message.replyTo) {
        const newThread: Thread = {
          rootMessage: message,
          replies: [],
          depth: 0,
          messageCount: 1
        }

        threads.push(newThread)
        totalMessages += 1


      } else {
        const wasAdded = addToReplies(message.replyTo, threads, message, totalMessages)
        if (!wasAdded) {
          orphanedMessages += 1
          threads.push({
            rootMessage: message,
            replies: [],
            depth: 0,
            messageCount: 1
          })
          totalMessages += 1

        }

      }



    }

  }


  mostActiveAuthor = getMostActiveAuthor(authors.sort())
  totalThreads = threads.length
  findThreadDepth(threads, 0)
  findNumberOfMessages(threads, 1)
  longestThread = getMaxThreadLength(threads)









  return {
    threads: threads, analytics: {
      totalMessages: totalMessages,
      totalThreads: totalThreads,
      longestThread: longestThread,     // max depth of any thread
      mostActiveAuthor: mostActiveAuthor,    // author with most messages (first alphabetically if tie)
      orphanedMessages: orphanedMessages  // messages that reply to non-existent messages
    }
  }

}


function getMostActiveAuthor(authors) {
  let mostActive = ["", 0]

  for (let author of authors) {
    if (author[1] > mostActive[1]) {
      mostActive = author
    }



  }

  return mostActive[0]
}


function findThreadDepth(threads, depth) {

  for (let thread of threads) {
    if (thread.replies.length > 0) {


      thread.depth = findThreadDepth(thread.replies, depth + 1)
    }


  }
  return depth
}


function findNumberOfMessages(threads, numMessages) {
  for (let thread of threads) {

    thread.numMessages = findThreadDepth(thread.replies, numMessages + thread.replies.length)

  }





}

function getMaxThreadLength(threads) {
  let max = 0

  for (let thread in threads) {
    if (thread.depth > max) {
      max = thread.depth
    }
  }

  return max
}



