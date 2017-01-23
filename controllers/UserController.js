import express from 'express';
import HTTPStatus from 'http-status';

import UserService from '../services/UserService';
import UserRepository from '../repositories/UserRepository';

import pg from 'pg';

const Client = pg.Client;
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://localhost/test_db";
// needed for heroku
// pg.defaults.ssl = true;

const PG_CLIENT = new Client(DATABASE_URL);
//disconnect client when all queries are finished
PG_CLIENT.on('drain', PG_CLIENT.end.bind(PG_CLIENT));
PG_CLIENT.connect();

const userRepository = new UserRepository(PG_CLIENT);
const userService = new UserService(userRepository);

const UserController = express();

UserController.post('/', (req, res) => {
  userService.createUser(req.body)
    .then((responseObject) => {
      res.status(HTTPStatus.CREATED).send(responseObject)
    })
    .catch((error) => res.status(HTTPStatus.BAD_REQUEST).send({error}));
});

export default UserController;
