# Objective
client, API server, database
Design a minimal Discord with the following features:
 - Users
 - Channels that can be created/deleted
 - Users can post into channels (text only messages)
 - Reactions (add an emoji reaction to someone's message)

 ## 1. Overview
We will be building a simple Discord clone. It will consist of Users, who can post Messages to a particular Channel or apply Reactions (emojis) to one another's Messages. Each User can post many Messages into any Channel. Messages contain only text. Channels contain a list of Messages (ordered by creation date). Emojis will belong to a User and a Message. Users will NOT be able to edit or delete Messages or Reactions, nor will they be able to update/PATCH anything. Messages are text-only. Reactions are stored as ids. Users will not have or be able to CRUD servers or anything else.

## 2. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

## 3. Core User Flows
The user should then be able to
1. see a list of channels, create or delete a Channel
2. see a specific Channel (with its Messages, each of which will also show its reactions)
3. create a Message within that Channel
4. add a Reaction to a Channel.

## 4. Data Models
The database will contain a:
* Users table (id:text, name:text, email:text, password:encrypted, etc.)
* Channels table (id:text, name: text)
* Messages table (id:text, userId: text, channelId:text, content:text)
* Reactions table(id:text, userId:text, messageId: text, reactionId:text). 

## 5. API Sketch
* The User in the client will be able to make POST or DELETE `/api/channels` requests to create or delete a Channel
* POST `/api/{objects}` requests to create a User, Message, or Reaction (with data according to their columns)
* GET `/api/channels` (which will respond with a list of Channels)
* GET `/api/channels/:id` to recieve a creation-ordered list of a Channel's Messages, each of which will have its content, and will include a list of Reactions with that message's Id.

State what each returns on success and what errors matter in V1.
