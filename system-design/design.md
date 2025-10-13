# Objective

Design a minimal Discord with the following features:
 - Users
 - Channels that can be created/deleted
 - Users can post into channels (text only messages)
 - Reactions (add an emoji reaction to someone's message)

 ## 1. Overview
Describe the product slice you are building. What can a user do in V1, and what is explicitly out of scope? In 4–6 sentences, explain the overall shape of the system (client → API → database) and how data moves through it at a high level.

### What can users do in V1 of the product?
Potential users can sign up, and users can log in to the application. In the application, a sidebar has a list of the channels that the user is in, including a button to create a channel. Channels can be removed as well. Next to the sidebar is the content of a selected channel, and users can post to said channel through a message form at the bottom. User can react to messages as well.

### How is this supported?

Users make requests to api routes on a server through a web client in their browser. This server interacts with a database containing the following tables whose details will be provided later in the document: users, channels, messages. At a high level, the user's actions in the client (signing up, logging in, managing and messaging channels) each involve the client requesting the server to both fetch and modify contents in the database in order to provide a functional user experience. Perhaps the website is hosted on the same server as the api routes interacting with the database, using React Router or a similar framework. 

## 2. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

It is attached and it is nice

## 3. Core User Flows
For each flow, describe what happens end-to-end in a few short paragraphs. For the Twitter question, this might be:
- Follow someone
- Create a post
- Load the home timeline

Focus on the path of a request and what data is read or written.

Sign up / log in: creates user in the DB. or gets a JWT for cookie  
Self-explanatory and low on time, diagram is nice  
Create channel: POST /channels  
Self-explanatory and low on time, diagram is nice  
Delet channel: DELETE /channels  
Self-explanatory and low on time, diagram is nice  
React: POST /message  
Self-explanatory and low on time, diagram is nice  
Other stuff:  
Self-explanatory and low on time, diagram is nice  

## 4. Data Models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

I was running out of time but my diagram is sweet. Maybe I missed a thing or two

users:  
username, hashedpassword, userid PK  
channels:  
channelname, userids STRINGLIST, channelid PK  
messages:  
channelid, messageid, userid, messagecontent, reactions STRINGLIST  
  
## 5. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

- `POST /follow`
- `POST /posts`
- `GET /timeline`

POST /signup, POST /signin:  
A user is made, a cookie is stored in browser  
GET /channels:  
Request includes id, response includes their channels  
POST /channel:  
makes new channel, response includes id  
DELETE /channel:  
given request id, deletes it. 201 deleted  
GET /messages:  
request channel id, response its messages  
POST /message:  
request channel id, messagecontent response 201 created (or the code needed)  
POST /reaction:  
request message id, reaction emoji, response 201 created  

State what each returns on success and what errors matter in V1.  

On success, if the user absolutely needs it, it will be returned.   
Errors will simply be: if you are not logged in, enjoy the fail whale!