import supertest from 'supertest';
import express from 'express';

import chai from 'chai';
chai.should();

const app = supertest.agent('http://localhost:8080');

describe('MessageController', () => {
  describe('post to /messages', () => {
    it('should create a message and return all fields', (done) => {
      const sender_id = "d3216765-9fbb-4771-be28-d388e784024f",
	          receiver_id = "6e523419-150f-49fc-a6c3-79eb301989d6",
	          contents = "Hey Alice it's Dave!";
      app
        .post('/messages')
        .send({ sender_id, receiver_id, contents })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.include.keys('sender_id', 'receiver_id', 'id', 'contents', 'date_sent');
          res.body.sender_id.should.equal(sender_id);
          res.body.receiver_id.should.equal(receiver_id);
          res.body.contents.should.equal(contents);
          done();
        });
    });
  });
});
