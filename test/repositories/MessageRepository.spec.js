import pg from 'pg';
import moment from 'moment';

import PgPool from '../../src/PgPoolConfig';
import MessageBuilder from '../utils/MessageBuilder';
import UserBuilder from '../utils/UserBuilder';

import sinon from 'sinon';

import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.should();
chai.use(sinonChai);

import MessageRepository from '../../src/repositories/MessageRepository';

describe('MessageRepository', () => {
  let messageRepository, messageBuilder;
  beforeEach(() => {
    messageRepository = new MessageRepository(PgPool);
    messageBuilder = new MessageBuilder();
  });
  afterEach(() => {
    messageBuilder.tearDown();
  });
  describe('#createMessage', () => {
    it('should successfully create a message and return the message id, sender_id, receiver_id, date_sent, and contents', (done) => {
      // given
      const sender_id = "e56a16ab-abb8-4bb7-8132-e6b366df051a", receiver_id = "fdd518d8-2f94-48d3-9142-86915bd43498", contents = "New phone, who dis?";
      const requestObject = {sender_id, receiver_id, contents};
      // when
      messageRepository.createMessage(requestObject)
        .then((result) => {
          result.rowCount.should.equal(1);
          result.rows[0].should.include.keys('id', 'sender_id', 'receiver_id', 'date_sent', 'contents');
          done();
        });
    });
  });
  describe('#getAllMessagesBetweenTwoUsers', () => {
    let message1, message2, message3, userId1, userId2;
    beforeEach(() => {
      userId1 = '2c3921d7-2465-4025-983f-6552bb19c855';
      userId2 = 'af25e231-3ad8-44ab-a744-5594c484bf23';
      message1 = { contents: 'What are you up to?', sender_id: userId1, receiver_id: userId2 };
      message2 = { contents: 'Nothing much man. Hbu?', sender_id: userId2, receiver_id: userId1 };
      message3 = { contents: 'I have other friends', sender_id: userId1 };
      return (
        messageBuilder.createMessage(message1)
          .then(() => {
            // delay is needed to fake the time stamp
            return setTimeout(messageBuilder.createMessage(message2), 1000);
          })
          .then(() => {
            return messageBuilder.createMessage(message3);
          })
      );
    });
    it('should return two messages that were sent between the users, from least recent to most recent', (done) => {
      messageRepository.getAllMessagesBetweenTwoUsers(userId1, userId2)
        .then((result) => {
          result.rowCount.should.equal(2);
          result.rows[0].should.include.keys('id', 'sender_id', 'receiver_id', 'date_sent', 'contents');
          result.rows[0].contents.should.equal(message1.contents);
          result.rows[1].contents.should.equal(message2.contents);
          done();
        });
    });
  });
});
