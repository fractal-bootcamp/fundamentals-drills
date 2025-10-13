# Objective

Design a minimal Discord with the following features:
 - Users
 - Channels that can be created/deleted
 - Users can post into channels (text only messages)
 - Reactions (add an emoji reaction to someone's message)

 ## 1. Overview
Describe the product slice you are building. What can a user do in V1, and what is explicitly out of scope? In 4–6 sentences, explain the overall shape of the system (client → API → database) and how data moves through it at a high level.



## 2. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

## 3. Core User Flows
For each flow, describe what happens end-to-end in a few short paragraphs. For the Twitter question, this might be:
- Follow someone
- Create a post
- Load the home timeline

Focus on the path of a request and what data is read or written.

// Sign in and Log in flow
- if they don't have an account -> create a new account
- if they have an existing account -> User Log in
- Redirect to main page

// Create a new channel
- On the left sidebar, there's button to create a new channel
- User can creat a new channel by clicking a button
- New channel is created on a left sidebar

// Delete a channel
- Right click on the channel, user can select 'delete a channel'
- Channel is deleted

// In a Channel
- Top part of the channel is chat
- On bottom, input field where user can type things(text message) and send the message
- Text will be appeared on the top part
- Other user send messages and that will be uploaded on the text history in real time

// Reaction
- User can right-click on an individual chat bubble 
- Select emoji to send it to the chat

## 4. Data Models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.


## 5. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

- `POST /follow`
- `POST /posts`
- `GET /timeline`

- GET /signin
- GET /login
- GET /main
- POST /chat
- POST /channel
- POST /emoji

State what each returns on success and what errors matter in V1.