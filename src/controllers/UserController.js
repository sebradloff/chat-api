import express from 'express';
import HTTPStatus from 'http-status';
import PgPool from '../PgPoolConfig';

import UserService from '../services/UserService';
import UserRepository from '../repositories/UserRepository';

const userRepository = new UserRepository(PgPool);
const userService = new UserService(userRepository);

const UserController = express();

UserController.get('/:id', (req, res) => {
  userService.getUser(req.params.id)
    .then((responseObject) => {
      res.status(HTTPStatus.OK).send(responseObject)
    })
    .catch((error) => res.status(HTTPStatus.BAD_REQUEST).send({error}));
});

UserController.post('/', (req, res) => {
  userService.createUser(req.body)
    .then((responseObject) => {
      res.status(HTTPStatus.CREATED).send(responseObject)
    })
    .catch((error) => res.status(HTTPStatus.BAD_REQUEST).send({error}));
});

export default UserController;
