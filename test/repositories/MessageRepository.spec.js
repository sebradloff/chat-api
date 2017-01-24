import pg from 'pg';
import PgPool from '../../src/PgPoolConfig';

import sinon from 'sinon';

import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.should();
chai.use(sinonChai);

import MessageRepository from '../../src/repositories/MessageRepository';

describe('MessageRepository', () => {
  let messageRepository;
  beforeEach(() => {
    messageRepository = new MessageRepository(PgPool);
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
});
