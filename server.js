import express from 'express';
import HTTPStatus from 'http-status';
import bodyParser from 'body-parser';

import UserController from './controllers/UserController';

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use('/users', UserController);

app.get('*', (req, res) => {
  res.status(HTTPStatus.OK).json({message: "hello"});
});

app.listen(port, () => {
  console.warn('Starting App.');
  console.warn(`Magic happens on port ${port}!`);
});
