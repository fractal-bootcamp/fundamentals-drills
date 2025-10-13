# Objective

Design a minimal Discord with the following features:
 - Users
 - Channels that can be created/deleted
 - Users can post into channels (text only messages)
 - Reactions (add an emoji reaction to someone's message)

 ## 1. Overview
Describe the product slice you are building. What can a user do in V1, and what is explicitly out of scope? In 4–6 sentences, explain the overall shape of the system (client → API → database) and how data moves through it at a high level.
 The client requests messages for all channels a user is in from the server, which queries the database. The messages are displayed on the client in their respective channels. The client can also request a list of emoji options from the server, which can be added to any message as a reaction.

## 2. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

## 3. Core User Flows
For each flow, describe what happens end-to-end in a few short paragraphs. For the Twitter question, this might be:
- Post message: The user submits a message, the message gets sent to the server, the server adds it to the database in the table for that channel

Focus on the path of a request and what data is read or written.

## 4. Data Models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.
- User table: PK UUID. Cols: id, username, email, channels
- Channel table: PK UUID. Cols: id, channel name, messages

## 5. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

- `POST /follow`
- `POST /posts`
- `GET /timeline`

- GET /channels
- GET /channels/messages
- POST /channels/messages
- POST /messages/reactions

State what each returns on success and what errors matter in V1.

- Get channels returns an array of channels a user is in
- GET channels/messages returns an array of message objects for each channel