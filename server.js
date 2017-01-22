const express = require('express');
const HTTPStatus = require('http-status');

const app = express();
const port = process.env.PORT || 8080;

app.get('*', function(req, res) {
  res.status(HTTPStatus.OK).json({message: "HELLO"});
});

app.listen(port, () => {
  console.warn('Starting App.');
  console.warn(`Magic happens on port ${port}!`);
});
