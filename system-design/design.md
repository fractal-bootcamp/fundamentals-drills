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

When a user tries to access a channel, the request contains information about person trying to access channel, such as their userid. The server takes that identifying information and asks the database things like: does the channel exist? Does the user have access to the channel? What messages are in the channel? The database collects this information and tells the server, and the server processes it and sends it to the user. 

When a user tries to write a message 

## 4. Data Models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

Tables needed: 
Users, where primary key would be user ID. Columns: email, password, login method, permissions, channels they are part of, 
Channels. Columns: channel name, members (link to users)
Messages Columns: text, user who posted it (link to users), channel it belongs to, time it was posted, if it is a response to other people's/a thread. Note that an emoji can can be linked to a user and marked as a response to another person. 

See diagram for example 

## 5. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

In all cases, response objects include status codes (such as 200 OK, 500 Internal Server Error or 404 Not Found.) They will also contain metadata like timestamps and relevant headers like referrer policy, etc. 

User-related endpoints

- `POST /login` : User trying to log in. Request should contain some type of handshake from user's web session, if the user has previously logged in. It should also contain identifying information from the user's login credential such as a username or email. The response will contain something like a handshake to be stored in cookies for the length of the session. If a user does not exist in the database and has never logged in, it will trigger an error. 

- `POST /signup`: User trying to sign up. Request should contain sign-up credentials such as email, username, and/or password. The response object will contain something like a handshake to be stored in cookies for the length of the session, and also possibly a redirect to be logged in. If a user's input is invalid or the user already exists in database, it should trigger error. 

Channel related endpoints 
- `GET /channel`: User wants to view channel. Request contains information about person trying to access channel, such as their userid. The responses it will trigger contain the channel: html, scripts, assets etc that make up the channel's interface and messages. A relevant error is if channel does not exist (404) or person does not have permissions to access channel. 
- `POST /channel` : User wants to create channel. Request contains id info for user who is trying to make the channel, and the content of the channel such as its name, permissions, voice/text etc. Response contains not much more than status code, but could also contain UI updates to reflect new channel. Relevant error: too many channels, lack of permissions, etc. 
- `DELETE /channel` : Delete channel. Details as above. 

Messages related endpoints. 
- `POST /channel/messages`: Post message in given channel. Contains info about user, such as permissions, and the message he is trying to post, such as content, date,  Response should be status code and potentially new UI. Error: lack of permissions, message too long/ too large. 
- `POST /channel/messages/messageID`: React to message in given channel. Contains info about user, such as permissions, and the reaction he is trying to post. Response should be status code and potentially new UI. Relevant error: message does not exist or exist any longer.

State what each returns on success and what errors matter in V1.