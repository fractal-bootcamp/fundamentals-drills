# Objective

Design a minimal Discord with the following features:
 - Users
 - Channels that can be created/deleted
 - Users can post into channels (text only messages)
 - Reactions (add an emoji reaction to someone's message)

 ## 1. Overview
Describe the product slice you are building. What can a user do in V1, and what is explicitly out of scope? In 4–6 sentences, explain the overall shape of the system (client → API → database) and how data moves through it at a high level.

Firstly, users can create an account and log in. Once logged in, users can see all the channels they're a member of, and each channel contains its respective message history. Users can create new channels, and add other users to channels that they are an admin of, and also delete channels they are an admin of.
Making servers that contain multiple channels is out of scope. 
Adding user avatars is out of scope. Letting users upload files such as images, videos, or documents is out of scope. 
Sending notifications to channel members about new messages or reacts is out of scope. 
Adding a channel description or changing a channel name is out of scope. 
DMs between users are out of scope. 

## 2. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

## 3. Core User Flows
For each flow, describe what happens end-to-end in a few short paragraphs. For the Twitter question, this might be:
- Follow someone
- Create a post
- Load the home timeline

Focus on the path of a request and what data is read or written.

- Create account
  - User is created with username, hashed password, and email

- Create channel
  - New channel is created with name and the user who created it as the first admin

- Add user to channel
  - any user who is an admin of a channel can add other users by their usernames

- Send message to channel
  - New message is created and associated with the relevant channel and the user who sent the message

- Send reaction to message
  - New reaction is created and associated with the relevant message

- Make user an admin
  - An admin of a channel can make any user in that channel an admin, giving them the ability to add other users

## 4. Data Models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

User
- username - primary key, string
- password - hashed password
- email

Channel
- name - string
- id - primary key
- members - many to many relation with User
- admins - many to many relation with User

Message
- channel - one to many relation with Channel
- timestamp
- id - primary key
- reactions - many to one relation with Reaction
- content - string
- user - one to many relation with User 

Reaction
- emoji - string
- user - one to many relation with user
- id - primary key


## 5. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

- `POST /follow`
- `POST /posts`
- `GET /timeline`

State what each returns on success and what errors matter in V1.

- `POST /channel` - create a new channel, user must be logged in and provide a name in the POST request

- `POST /send_message` - sends a message to the channel specified by ID in the POST request body. User must be logged in and be a member of that channel. 

- `POST /send_react` - must include ID of message it's reacting to, the emoji for the reaction, and the current user must be logged in and a member of the channel the message being reacted to is in

- `POST /undo_react` - deletes reaction, must include reaction ID and the logged in user must be the user who made the react originally

- `POST /delete_message` - must include message ID in the POST body, messages can only be deleted by the user who made the message, or by an admin of the channel the message is in

`GET /channel/:id/:page` - gets a page of a channel's message history, with the newest messages coming first. Response will include pagination info like how many pages are left

