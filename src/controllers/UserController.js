import express from 'express';
import HTTPStatus from 'http-status';
import PgPool from '../PgPoolConfig';
import logger from '../Logger';

import UserService from '../services/UserService';
import UserRepository from '../repositories/UserRepository';

const userRepository = new UserRepository(PgPool);
const userService = new UserService(userRepository);

const UserController = express();

/**
 * @swagger
 *   parameters:
 *     user-id:
 *       name: user-id
 *       in: path
 *       description: The user uuid
 *       type: string
 *       required: true
 */

/**
 * @swagger
 * definition:
 *   Error:
 *     type: object
 */

/**
 * @swagger
 * definition:
 *   User:
 *     properties:
 *       name:
 *         type: string
 *       id:
 *         type: string
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of users
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/User'
 *       400:
 *         description: Unexpected error
 *         schema:
 *             $ref: '#/definitions/Error'
 */
UserController.get('/', (req, res) => {
  userService.getAllUsers()
    .then((responseObject) => {
      res.status(HTTPStatus.OK).send(responseObject);
    })
    .catch(error => res.status(HTTPStatus.BAD_REQUEST).send({ error }));
});

/**
 * @swagger
 * /users/{user-id}:
 *   parameters:
 *     - $ref: '#/parameters/user-id'
 *   get:
 *     tags:
 *       - Users
 *     description: Returns a particular user
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Get a single user
 *         schema:
 *             $ref: '#/definitions/User'
 *       400:
 *         description: Unexpected error
 *         schema:
 *             $ref: '#/definitions/Error'
 */

UserController.get('/:id', (req, res) => {
  userService.getUser(req.params.id)
    .then((responseObject) => {
      res.status(HTTPStatus.OK).send(responseObject);
    })
    .catch(error => res.status(HTTPStatus.BAD_REQUEST).send({ error }));
});

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     description: Create a new user
 *     parameters:
 *       - name: name
 *         in: body
 *         description: The name of the user
 *         schema:
 *           type: string
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Created a user
 *         schema:
 *             $ref: '#/definitions/User'
 *       400:
 *         description: Unexpected error
 *         schema:
 *             $ref: '#/definitions/Error'
 */

UserController.post('/', (req, res) => {
  logger.log('info', `create user request with payload ${JSON.stringify(req.body)}`);
  userService.createUser(req.body)
    .then((responseObject) => {
      res.status(HTTPStatus.CREATED).send(responseObject);
    })
    .catch(error => res.status(HTTPStatus.BAD_REQUEST).send({ error }));
});

export default UserController;
