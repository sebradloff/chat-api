import express from 'express';
import HTTPStatus from 'http-status';
import PgPool from '../PgPoolConfig';

import MessageService from '../services/MessageService';
import MessageRepository from '../repositories/MessageRepository';

const messageRepository = new MessageRepository(PgPool);
const messageService = new MessageService(messageRepository);

const MessageController = express();

MessageController.post('/', (req, res) => {
  messageService.createMessage(req.body)
    .then((responseObject) => {
      res.status(HTTPStatus.CREATED).send(responseObject);
    })
    .catch(error => res.status(HTTPStatus.BAD_REQUEST).send({ error }));
});

export default MessageController;
