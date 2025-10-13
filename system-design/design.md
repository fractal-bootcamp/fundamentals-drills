# Objective

Design a minimal Discord with the following features:
 - Users
 - Channels that can be created/deleted
 - Users can post into channels (text only messages)
 - Reactions (add an emoji reaction to someone's message)

 ## 1. Overview
Describe the product slice you are building. What can a user do in V1, and what is explicitly out of scope? In 4–6 sentences, explain the overall shape of the system (client → API → database) and how data moves through it at a high level.

We are building a minimal Discord clone that includes users, messages, channels, and message reactions.
To do this, we will include a database, a client interface (e.g. React app), and API endpoints that enable the client to fetch and send data to the database. 
Users will be able to login and retrieve channels that they belong to.
Users will also be able to see messages from other users, write their own messages, and engage with messages using reactions within these channels.
Out of scope: Creating message threads, channel roles and permissions, broadcasting messages across channels.


## 2. Architecture Diagram
Attach a simple boxes-and-arrows diagram showing client, API server, and database. Label arrows with the main requests (e.g., "POST /follow", "GET /timeline"). Keep it legible and minimal.

## 3. Core User Flows
For each flow, describe what happens end-to-end in a few short paragraphs. For the Twitter question, this might be:
- Follow someone
- Create a post
- Load the home timeline

Core User Flows:
- create and view a channel
    - a user is able to click a button that sends a post request to the database to create a channel and subsequently is able to view and click into this channel to see the relevant messages
- invite a user to a channel
    - a user is able to invite users by email or username to a channel by sending a post request to the database to send an invite. based on the input for username or email, get the invitees user id and post to the channel_invites table. when a user accepts an invite, their id is added to the channel_members table. users will be able to view their channels and click into them. 
- post a message in a channel
    - once inside a channel, a user is able to see all of the message history within the channel. there is an open message input box with a send button. when they hit the send button, a post request is sent to the database to insert the user id, message, and channel id to the messages database. the new message should appear in the message history. 
- add an emoji to a message
    - users should be able to hover upon messages and an array of available emojis should display to the user. the user should be able to click on an emoji to add a reaction (sending a post request to the database to the message_reactions table). users can add many emojis to a single message and should also be able to add or remove an emoji by incrementing the emoji count by 1. on hover of any of the reactions, the usernames who made the reaction should display
- follow a user
    - an option to view other users and click a follow button. upon clicking the follow, the user should be able to be added to the user_follows table. (currently out of scope: accepting user follow requests, all follow requests are immediately granted)

Focus on the path of a request and what data is read or written.

## 4. Data Models
List your tables and columns, with primary keys and any unique constraints or indexes you need for V1. Include 1–2 example rows where helpful.

users
- id
- name
- username
- email

user_follows
- id
- user_id
- follows_user_id
- created_at
- updated_at
- unfollowed_at (timestamp present if no longer following or null if actively following)


channels
- id
- name
- description
- created_by_user_id
- created_at
- update_at

channel_invites
- id
- sent_by_user_id
- user_invited_id
- sent_at
- invite_response_at
- is_accepted_invite
- invite_expires_time

channel_members
- id
- channel_id
- user_id
- joined_channel_at

<!-- user_channel_roles
- id
- user_id
- channel_id
- role
- channel_permissions -->

messages (or posts)
- id
- user_id
- channel_id
- message
- created_at
- updated_at

message_reactions
- id
- user_id
- associated_message_id
- emoji_type
- emoji
- created_at
- updated_at

## 5. API Sketch
List the minimal endpoints and their request/response shapes at a high level. Keep this terse.

- `POST /follow`
- `POST /posts`


State what each returns on success and what errors matter in V1.


- `POST /follow`
    - this will send the user id and the follows_user_id to the database and post to the user_follows table

- `POST /posts`
    - this will send the user_id, message, and channel_id to post to the messages table

- `GET /user-channels`
    - get all the user's channels from the user_channels table

- `GET /timeline`
    - this will get all of the messages relevant to the user_id from the messages table (optionally with some basic or algorithmic sorting)

- `GET / POST channel-messages`
    - this will get all the channel messages from a channel id when a user clicks into a channel that they have access to.

 - `GET / POST message-reactions`
    - posts and fetches message reactions
