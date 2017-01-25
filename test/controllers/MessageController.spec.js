import supertest from 'supertest';
import express from 'express';
import MessageBuilder from '../utils/MessageBuilder';

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
  describe('get to /messages/users/:userId1/users/:userId2', () => {
    let messageBuilder, userId1, userId2;
    beforeEach(() => {
      messageBuilder = new MessageBuilder();
      userId1 = '2c3921d7-2465-4025-983f-6552bb19c855';
      userId2 = 'af25e231-3ad8-44ab-a744-5594c484bf23';
      const message1 = { contents: 'What are you up to?', sender_id: userId1, receiver_id: userId2 };
      const message2 = { contents: 'Nothing much man. Hbu?', sender_id: userId2, receiver_id: userId1 };
      return (
        messageBuilder.createMessage(message1)
          .then(() => {
            messageBuilder.createMessage(message2);
          })
      );
    });
    afterEach(() => {
      messageBuilder.tearDown();
    });
    it('should get all 2 messages sent between those users', (done) => {
      const url = encodeURI(`/messages/users/${userId1}/users/${userId2}`);
      app
        .get(url)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.include.keys('userId1', 'userId2', 'messages');
          res.body.messages.length.should.equal(2);
          done();
        });
    });
  });
});
