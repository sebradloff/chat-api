import express from 'express';
import HTTPStatus from 'http-status';

const app = express();
const port = process.env.PORT || 8080;

app.get('*', (req, res) => {
  res.status(HTTPStatus.OK).json({message: "hello"});
});

app.listen(port, () => {
  console.warn('Starting App.');
  console.warn(`Magic happens on port ${port}!`);
});
