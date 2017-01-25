import express from 'express';
import HTTPStatus from 'http-status';
import PgPool from '../PgPoolConfig';

import MessageService from '../services/MessageService';
import MessageRepository from '../repositories/MessageRepository';

const messageRepository = new MessageRepository(PgPool);
const messageService = new MessageService(messageRepository);

const MessageController = express();

/**
 * @swagger
 * definition:
 *   Message-post:
 *     properties:
 *       contents:
 *         description: The actual text portion that contains the message
 *         type: string
 *       receiver_id:
 *         description: The uuid of the user receiving the message
 *         type: string
 *       sender_id:
 *         description: The uuid of the user sending the message
 *         type: string
 */

 /**
  * @swagger
  * definition:
  *   Message-get:
  *     properties:
  *       id:
  *         description: Message uuid
  *         type: string
  *       contents:
  *         description: The actual text portion that contains the message
  *         type: string
  *       receiver_id:
  *         description: The uuid of the user receiving the message
  *         type: string
  *       sender_id:
  *         description: The uuid of the user sending the message
  *         type: string
  *       date_sent:
  *         description: Timestamp of when the message was entered into the db
  *         type: string
  */

  /**
   * @swagger
   * /messages/users/{user-id}/users/{user-id}:
   *   parameters:
   *     - $ref: '#/parameters/user-id'
   *   get:
   *     tags:
   *       - Users
   *       - Messages
   *     description: Returns all messages between the two specified users
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Returns the messages between the two users in chronological order, least recent to most recent.
   *         schema:
   *           type: object
   *           properties:
   *             userId1:
   *               type: string
   *               description: The uuid of one of the users
   *             userId2:
   *               type: string
   *               description: The uuid of the other user
   *             messages:
   *               $ref: '#/definitions/Message-get'
   *       400:
   *         description: Unexpected error
   *         schema:
   *             $ref: '#/definitions/Error'
   */

MessageController.get('/users/:userId1/users/:userId2', (req, res) => {
  const { userId1, userId2 } = req.params;
  messageService.getAllMessagesBetweenTwoUsers(userId1, userId2)
    .then((responseObject) => {
      res.status(HTTPStatus.OK).send(responseObject);
    })
    .catch(error => res.status(HTTPStatus.BAD_REQUEST).send({ error }));
});

/**
 * @swagger
 * /messages:
 *   post:
 *     tags:
 *       - Messages
 *     description: Create a message
 *     parameters:
 *       - name: message
 *         in: body
 *         description: Message object
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Message-post'
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Created a message
 *         schema:
 *             $ref: '#/definitions/Message-get'
 *       400:
 *         description: Unexpected error
 *         schema:
 *             $ref: '#/definitions/Error'
 */
MessageController.post('/', (req, res) => {
  messageService.createMessage(req.body)
    .then((responseObject) => {
      res.status(HTTPStatus.CREATED).send(responseObject);
    })
    .catch(error => res.status(HTTPStatus.BAD_REQUEST).send({ error }));
});

export default MessageController;
