# Objective

Design a minimal Discord with the following features:

- Users
- Channels that can be created/deleted
- Users can post into channels (text only messages)
- Reactions (add an emoji reaction to someone's message)

## 1. Overview

<!-- Describe the product slice you are building. What can a user do in V1, and what is explicitly out of scope? In 4–6 sentences, explain the overall shape of the system (client → API → database) and how data moves through it at a high level. -->

We're building an application that allows multiple users to message each other in a public chat channel (similar to Internet Relay Chat). The functionality we'd want is for users to be able to send and receive messages in the public chat channel in any UTF-8 formatting including rendering emojis. The reactions to another user's messages will behave similar to how users can like or add face emojis as reactions to messages that appear around the text (exact positioning isn't import for v1 MVP) as if an annotation.

The client will request messages to be displayed in the app that come as a response to an HTTP fetch request for data saved in a remote database on the our server. A user's browser will send a request to the database to fetch the last 50 messages. We'll render that array of text strings on screen in descending order from the most recent that was saved to the database.

**What's explicitly out of scope for V1:**

- Sending private messages between users
- Sending rich text or multimedia (still images, video files, any special text formatting: i.e. rich text, markdown etc.)
- Giving users the ability to create their own servers with multiple channels (chat rooms)

## 2. Architecture Diagram

<!-- Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal. -->

## 3. Core User Flows

For each flow, describe what happens end-to-end in a few short paragraphs. For the Twitter question, this might be:

- Follow someone
- Create a post
- Load the home timeline

Focus on the path of a request and what data is read or written.

## 4. Data Models

List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

### users table (to be handled by auth solution)

primaryId userName userPassword channels a user is subscribed to

### chats table

primaryId userName messages

### messages table

primaryId userName messages channels

## 5. API Sketch

List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

this assumes each endpoint will be specific to a channel i.e. /channels/users

- `GET /users`
  - A successful HTTP GET request will return an array of users who are currently logged onto this channel. After V1 we'll have a list of users who are essentially 'subscribed' to this channel and return wether they're actively logged in and looking at the channel vs. if they are a part of this channel, but not currently logged in and online.
  - req {}
  - res {}
- `POST /messages`
  - A successful HTTP POST request will save the current user's message they've typed in and save it to the table representing this server's chat messages. If this request is successful it'll return the HTTP code 201 for a message saved to the database.
- `GET /chat`
  - A successful HTTP GET request will return an array of representing 'the chat room channel' -- the most current messages from all users who've sent a message in the channel. For v1 we will limit scope to something like the last 30-50 recent messages. Later we'll build a full history representing all messages within the last 15-30 days let's say.

State what each returns on success and what errors matter in V1.
