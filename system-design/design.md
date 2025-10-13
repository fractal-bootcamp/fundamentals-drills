# Objective

Design a minimal Discord with the following features:
 - Users
 - Channels that can be created/deleted
 - Users can post into channels (text only messages)
 - Reactions (add an emoji reaction to someone's message)

 ## 1. Overview
Describe the product slice you are building. What can a user do in V1, and what is explicitly out of scope? In 4–6 sentences, explain the overall shape of the system (client → API → database) and how data moves through it at a high level.

The client(user) should be able to interface with the server which will first use a database to authenticate a session. If that session is authticated, the API is called to fetch all channels the user has and allow them to create or delete channels. They will also be allowed an API endpoint that fetches all messaages in that channel. If users delete a channel, in this version we will still retain all messages in our messages table but can delete that particular entry in the users table field for channels. Users will be able to post messages and add emoji, through a POST endpoint that will also add those items to the respective fields in the Messages table. We will not be doing any private messages or channels in this iteration

## 2. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

## 3. Core User Flows
For each flow, describe what happens end-to-end in a few short paragraphs. For the Twitter question, this might be:

A signin/ signup that uses BetterAuth to create session for users to access the various APIs of the app.

User sessions. These will be validated through some authentication framework like BetterAuth allowing cookies to store token to track user session. API endpoints will necessitate those cookies to be in the header to access them.

Channels: Channels will be stored as a field of in the User table in the database. There will be a component which after calling the endpoint GET/channel which will store all channels and a separate endpoint GET/channel/:id for accessing the specific messages in that channel
    And input field on the sidebar with access to the endpoint through a fetch call too POST/addchannel, will update the users table in the channels field with the input value and the increment the id serial.
    A button on the side of each entry to delete will also fetch to endpoint POST/channel/delete/:id which will update the users table to remove the channel

Posts: An input field will call fetch to POST/newmessage that will create a new entry in the messages table. Reaction emojis will be UI element that also call fetch the POST/message and will store the emoji as a string. The UI will use the string to show the correct icon.
    Also, when accessing a channel, a GET/messages/:channel will select all from the Users table in the DB and will render them in a react component.


Focus on the path of a request and what data is read or written.

## 4. Data Models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

Users - userid serial and primary key, 

Messages - 

## 5. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

- `POST /follow`
- `POST /posts`
- `GET /timeline`

State what each returns on success and what errors matter in V1.