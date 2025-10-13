# Objective

Design a minimal Discord with the following features:
 - Users (assuming users are created,have already joined the discord server)
 - Channels that can be created/deleted
 - Users can post into channels (text only messages)
 - Reactions (add an emoji reaction to someone's message)

 ## 1. Overview
Describe the product slice you are building. What can a user do in V1, and what is explicitly out of scope? In 4–6 sentences, explain the overall shape of the system (client → API → database) and how data moves through it at a high level.


What can a user do in V1?
- A user can create a public channel (all users have access to any created channel)
- A user can delete any channel on the server, even if they did not create the channel
- A user can enter a text message into any channel
- A user can deleta a message theyve entered into a channel
- A user can "react" to a message within a channel by clicking a button 

What is out of scope?
- Users cannot be created
- assuming one server- users cannot create their own server

Client View
The client will show a list of users (retrieved using the Discord API/an external db) and a list of channels(retrieved using the Discord API/an external db) on separate pages. Each channel page will show a list of messages (retrieved using the Discord API/an external db).

## 2. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

GET/POST Requests for features

GET /users from user table within db

GET /messages from channels within db
POST message to channel 
POST delete message from channel

GET reaction on message
POST reaction on message 

POST /create a new channel 


## 3. Core User Flows
For each flow, describe what happens end-to-end in a few short paragraphs. For the Twitter question, this might be:
- Follow someone
- Create a post
- Load the home timeline

Focus on the path of a request and what data is read or written.

1. When a user creates a public channel, the new channel needs to get added to the channels db -> check db if the channel already exists 
2. When a user deletes a public channel, the channel needs to be removed from the channels db -> update the db 

## 4. Data Models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

Table 1: User table to contain:
- user_id
- date_time //time user performed an action
- server_name //server name, for future usage
- user_action //what did the user do, action ID


Table 2: list of channels to contain:
- channel
- creation_date
- created_by
- deleted
- deleted_by

Table 3: Channel Actions to contain:
- user_id
- date_time
- message
- message_id
- server_name //server name, for future usage
- user_channel_action//what did the user do in the channel
- channel_accessed //which channel did the user post to, if at all
- reaction
- reaction_user_id //id of user 


## 5. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

- `POST /follow`
- `POST /posts`
- `GET /timeline`

State what each returns on success and what errors matter in V1.