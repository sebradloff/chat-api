import express from 'express';
import HTTPStatus from 'http-status';
import PgClient from '../PgClientConfig';

import UserService from '../services/UserService';
import UserRepository from '../repositories/UserRepository';

const userRepository = new UserRepository(PgClient);
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
