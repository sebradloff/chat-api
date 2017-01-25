import express from 'express';
import bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';

import UserController from './controllers/UserController';
import MessageController from './controllers/MessageController';

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use('/users', UserController);
app.use('/messages', MessageController);

const swaggerConfig = {
  info: {
    title: 'Sebastian Radloff Chat API',
    version: '1.0.0'
  }
};
const options = {
  swaggerDefinition: swaggerConfig,
  apis: ['./src/controllers/*.js']
};
const swaggerSpec = swaggerJSDoc(options);

app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.listen(port, () => {
  console.warn('Starting App.');
  console.warn(`Magic happens on port ${port}!`);
});
