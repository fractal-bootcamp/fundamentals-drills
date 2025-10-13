# Objective

Design a minimal Discord with the following features:

-   Users
-   Channels that can be created/deleted
-   Users can post into channels (text only messages)
-   Reactions (add an emoji reaction to someone's message)

## 1. Overview

Describe the product slice you are building. What can a user do in V1, and what is explicitly out of scope? In 4–6 sentences, explain the overall shape of the system (client → API → database) and how data moves through it at a high level.

Product is a social media web application called Discord. Discord has users who can socialize with each other

Users: must be able to sign up, login, log out, change settings(notifications, preferences, etc.), add friends, remove friends, block friends, dm friends, create channels, join channels, leave channels, delete

client: REACT. Login page. Sign up page. Home page/dashboard nav. Settings page. Friends manegment page. Channels page. conditional rendering. Input forms submit -> request api endpoints
→ API: handle requests. Provide endpoints. Verify and process requests and serve files/code/data to client. GET POST. Query databases SQL or otherwise.
→ database: schema, Add, Delete, modify, data,

## 2. Architecture Diagram

Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.
https://excalidraw.com/#json=LA_qehv9Bw7tOKf94NBwl,8iz09rO-pqUnrmGzpvaQpQ 

## 3. Core User Flows

For each flow, describe what happens end-to-end in a few short paragraphs. For the Twitter question, this might be:

-   Follow someone
-   Create a post
-   Load the home timeline

Focus on the path of a request and what data is read or written.

Example: login
Client form, sumbit info, post to endpoint. Server authenticates, reponds(accept/reject) give token, Queries Database

## 4. Data Models

List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

channels mute chats, Users protected by authentication.
Data: primary id, name, email, password, settings, channels data, friends data,
Channels: Create, delete, invite people
Data: primary id, Name, owner, members, permissions, chats, posts
Posts
Data: primary id, sender, text, size, time, reactions, parent chat

## 5. API Sketch

List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

-   `POST /follow`
-   `POST /posts`
-   `GET /timeline`

State what each returns on success and what errors matter in V1.
