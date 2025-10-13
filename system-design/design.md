# Objective

Design a minimal Discord with the following features:
 - Users
 - Channels that can be created/deleted
 - Users can post into channels (text only messages)
 - Reactions (add an emoji reaction to someone's message)

 ## 1. Overview
Describe the product slice you are building. What can a user do in V1, and what is explicitly out of scope? In 4–6 sentences, explain the overall shape of the system (client → API → database) and how data moves through it at a high level.

For V1 you would have a basic react router (alternatively react + vite-express) server and client and a database (different databases can be used but we will assume SQL for this), you would also have an api layer that will field the different types of requests (GET, POST, DELETE, etc) and pass the requests to the server where the db calls and server logic will be. The user will be have to initialy sign up and afterwards log in, which will require auth functionality, and after login they will be able to create, access, and delete channels. Once in a given channel they will be able to send text only messages and view other messages sent to that channel which would require a websocket for timely updates to the channel when messages were sent.

Explicitly out of scope is permissions, so all users would be able to view, send messages to, or delete all channels. Somewhat borderline is the ability to input the names of channels, which for simplicity's sake will be considered out of scope, so the channel names will simply be their ids (for this reason human readable ids would be preferred for channels)


## 2. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.







## 3. Core User Flows
For each flow, describe what happens end-to-end in a few short paragraphs. For the Twitter question, this might be:
- Follow someone
- Create a post
- Load the home timeline

Focus on the path of a request and what data is read or written.

The sign up/log in flow will require the client to send a POST request to the API which will then send the information from the request to the server, the server will process this request and add the user to the db in the event of a sign up, or verify their login info and/or auth token before giving them access to the app. The server would then redirect the user to the channels page, which the client would render and would have a list of channels that the user can access, as well as some functionality that would allow them to create or delete channels. 

Selecting a channel would another GET request to the api and would redirect user to the specified channel which the client would show, deleting a channel would send a DELETE request to the api which would then tell the server to remove the relevant row from the channel and the client would rerender to show an updated channels list, creating a channel would result in a similar flow but a POST rather than a delete, and the db call would insert a new row for the new channel. 

From within the channel, the client would display any previously sent messages by sending a GET request for that channel, which would have the api tell the server to query the database for all messages within a specific channel, then either using polling or websockets, any messages sent by any users in the channel would cause the client to rerender and display the messages for each user. 

When a user would send a message the client would optimistically render their message in the chat and would then POST to the api where the message data would be passed along to the server which would insert the message as a row in that channel's table, as well as trigger the websocket to broadcast to every other user in the channel and trigger a rerender of their pages.

## 4. Data Models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

There would be a users table, with:
    a UserID column of generated UUIDs that would also be primary keys (string)
    an email column with the user's email (which would also be their username) (string)
    multiple columns which would store all the data required by the auth system (various)
    
NOTE: Passwords would not be stored in this database (this storage would be done by the auth system)

A channels table with: 
    a channelID column (hopefully human readable) (string)
    a messages column (array of objects with a name (string), message (string), and createdAt field (date))


## 5. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

    POST - /signIn - req: login info to auth
    POST - /signUp - req: login info to auth
    POST - /createChannel 
    GET - /channels - res: list of all channels
    DELETE - /deleteChannel - req: channel to be deleted


State what each returns on success and what errors matter in V1.