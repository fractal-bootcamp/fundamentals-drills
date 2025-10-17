/**
 * Programming Puzzle — Text Messaging System with Threading
 *
 * You are building a text messaging system that processes a series of messages
 * and organizes them into conversation threads. Messages can reply to other messages,
 * creating nested thread structures. The system needs to handle message sending,
 * reactions, edits, and deletions, while maintaining proper thread relationships.
 *
 * Input:
 *   - events: Array of event objects, processed in order. Each event has a type and data:
 *       { type: "send", id: string, sender: string, text: string, replyTo?: string }
 *         - Creates a new message. If replyTo is provided, it's a reply to that message ID
 *       { type: "react", messageId: string, user: string, emoji: string }
 *         - Adds a reaction to a message. Same user+emoji combination increments count
 *       { type: "edit", messageId: string, newText: string }
 *         - Changes the text of a message
 *       { type: "delete", messageId: string }
 *         - Marks a message as deleted (but preserves it for thread structure)
 *
 * Output:
 *   {
 *     messages: Array of message objects with structure preserved
 *     threads: Map of thread roots (messages with no replyTo) to their reply chains
 *     errors: Array of error strings for invalid operations
 *   }
 *
 * Rules:
 *   - Message IDs must be unique. Sending with duplicate ID is an error (skip it)
 *   - Cannot reply to a non-existent or deleted message (error, skip the message)
 *   - Cannot react to, edit, or delete a non-existent message (error, continue)
 *   - Deleted messages show as "[deleted]" but remain in threads to preserve structure
 *   - Reactions are grouped by emoji, storing count and list of users who reacted
 *   - A message can only be edited by its original sender (not enforced - any edit works)
 *   - Thread depth can be unlimited (replies to replies to replies...)
 *   - Messages should be organized showing which messages are replies to others
 *
 * Examples:
 *   Simple thread:
 *     events: [
 *       { type: "send", id: "1", sender: "alice", text: "Hello!" },
 *       { type: "send", id: "2", sender: "bob", text: "Hi Alice!", replyTo: "1" },
 *       { type: "react", messageId: "1", user: "bob", emoji: "👋" }
 *     ]
 *     => Message "1" has one reply ("2") and one reaction (👋 from bob)
 *
 *   Deleted message in thread:
 *     events: [
 *       { type: "send", id: "1", sender: "alice", text: "Start" },
 *       { type: "send", id: "2", sender: "bob", text: "Middle", replyTo: "1" },
 *       { type: "delete", messageId: "2" },
 *       { type: "send", id: "3", sender: "carol", text: "End", replyTo: "2" }
 *     ]
 *     => Message "2" shows as deleted, but "3" is still a reply to "2" (error)
 */

type Message = {
  id: string;
  sender: string;
  receiver?: string;
  reactions?: string[]
}






export function processMessages(input: any) {

  let messages: Message[] = []
  let errors: string[] = []
  let threads: string[] = []

  for (let message of input.events) {
    if (message.type === "send" && !message.replyTo && messages.find(t => t.id === message.id)!) {
      threads.push(message.id)
      const m = { id: message.id, sender: message.sender, reactions: [] } as Message
      messages.push(m)
      threads.push(message.id)

    } else if (message.type === "send" && message.replyTo) {
      if (threads.includes(message.replyTo)) {
        const prevMessage = messages.find(t => t.id === message.replyTo)!
        prevMessage.receiver = message.sender
        messages.push({ id: message.id, sender: message.sender, receiver: prevMessage.sender, reactions: [] })
        threads.push(message.id)


      } else {
        errors.push("Cannot reply to non-existent message")
      }

    } else if (message.type === "delete") {
      const messageToDeleteIndex = messages.indexOf(messages.find(t => t.id === message.messageId)!)
      messages.splice(messageToDeleteIndex, 1)
      const rootToDeleteIndex = threads.indexOf(threads.find(t => t === message.messageId)!)

      threads.splice(rootToDeleteIndex, 1)



    } else if (message.type === "react") {
      const messageToReactto = messages.find(t => t.id === message.messageId)
      if (messageToReactto) {
        messageToReactto!.reactions!.push(message.emoji)
      } else {
        errors.push("cannot react to nonexistent message")
      }


    }




  }



  return { messages: messages, errors: errors, threads: threads }



}
