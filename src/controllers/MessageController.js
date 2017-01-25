import express from 'express';
import HTTPStatus from 'http-status';
import PgPool from '../PgPoolConfig';

import MessageService from '../services/MessageService';
import MessageRepository from '../repositories/MessageRepository';

const messageRepository = new MessageRepository(PgPool);
const messageService = new MessageService(messageRepository);

const MessageController = express();

MessageController.get('/users/:userId1/users/:userId2', (req, res) => {
  const { userId1, userId2 } = req.params;
  messageService.getAllMessagesBetweenTwoUsers(userId1, userId2)
    .then((responseObject) => {
      res.status(HTTPStatus.OK).send(responseObject);
    })
    .catch(error => res.status(HTTPStatus.BAD_REQUEST).send({ error }));
});

MessageController.post('/', (req, res) => {
  messageService.createMessage(req.body)
    .then((responseObject) => {
      res.status(HTTPStatus.CREATED).send(responseObject);
    })
    .catch(error => res.status(HTTPStatus.BAD_REQUEST).send({ error }));
});

export default MessageController;
