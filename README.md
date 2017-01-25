# chat-api

# Tests
To run the tests, the app must be running, `$ npm start && npm run test`.

# Heroku
When deploying to Heroku, make sure the db is setup. You can run a quick one off task
which will run the schema.
`$ heroku run npm run load:schema`
# DB table design
I ended up choosing postgresql as the db of choice, mainly b/c I know it is supported on heroku with node applications.

| user        |
| ------------|
| id (uuid)   |
| name (text) |

| message               |
| ----------------------|
| id (uuid)             |
| contents (text)       |
| date_sent (timestamp) |
| sender_id (uuid)      |
| receiver_id (uuid)    |

This very simply illustrates that every message has a sending user and receiving user, with the assumption that messages are only intended to be viewed between to users.
To scale this for messages to be consumed between multiple users, I would have to consider adding a third table of perhaps chat_room, which then arises a user_chat_room many to many table in which we connect which users are subscribed to which rooms.
