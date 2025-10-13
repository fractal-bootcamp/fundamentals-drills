# Objective

Design a minimal Discord with the following features:
 - Users
 - Channels that can be created/deleted
 - Users can post into channels (text only messages)
 - Reactions (add an emoji reaction to someone's message)

 ## 1. Overview
Describe the product slice you are building. What can a user do in V1, and what is explicitly out of scope? In 4–6 sentences, explain the overall shape of the system (client → API → database) and how data moves through it at a high level.

V1 Discord Product Slice:

- Shape:
the Client runs the app and a new session is created with the sign in page. The user then signs in which fetches the existings channels (GET from DB). Here we have 3 onClick events: app.delete, app.post(new channel), app.get(the chat within an existing channel). Each message sent is a POST to the messages[] array (or in DB). reaction is a POST to the DB and with map on the frontend can render when a reaction exists.

## 2. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

see diagram.png
![alt text](image.png)

## 3. Core User Flows
For each flow, describe what happens end-to-end in a few short paragraphs. For the Twitter question, this might be:
- Follow someone
- Create a post
- Load the home timeline

Focus on the path of a request and what data is read or written.

- Flow:
 User login, create new channel, can view existing channels and delete channel, users click on a channel to access a text input, chat history shown, each chat message can get a reaction.

## 4. Data Models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

BetterAuth schema for session and users
postgres schema for channels, channel ID, Channel ID's chat, reactions

## 5. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

- `POST /follow`
- `POST /posts`
- `GET /timeline`

GET /channels
POST /channel
DELETE /channel/:id

GET /Chat
POST /message
PUT /message (if I have time)

GET /reactions
POST /reaction
PUT /reaction

State what each returns on success and what errors matter in V1.