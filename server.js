import express from 'express';
import HTTPStatus from 'http-status';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

const Client = require('pg').Client;

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://localhost/test_db";
// needed for heroku
// pg.defaults.ssl = true;

const client = new Client(DATABASE_URL);
//disconnect client when all queries are finished
client.on('drain', client.end.bind(client));
client.connect();

app.post('/users', (req, res) => {
  const name = req.body.name;

  if (name === undefined) {
    res.status(HTTPStatus.BAD_REQUEST).send({error: 'Please provide a name field to create a user.'});
  } else {
    const createUser = client.query('INSERT INTO chat_api.user (name) VALUES ($1) RETURNING chat_api.user.id, chat_api.user.name;', [name]);
    createUser.on('end', (result) => {
      const id = result.rows[0].id;
      const name = result.rows[0].name;
      res.status(HTTPStatus.CREATED).send({id, name});
    });
  }
});

app.get('*', (req, res) => {
  res.status(HTTPStatus.OK).json({message: "hello"});
});

app.listen(port, () => {
  console.warn('Starting App.');
  console.warn(`Magic happens on port ${port}!`);
});
