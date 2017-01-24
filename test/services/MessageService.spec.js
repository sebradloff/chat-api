import pg from 'pg';
import sinon from 'sinon';
require('sinon-as-promised');
import chai from 'chai';
import sinonChai from "sinon-chai";
chai.should();
chai.use(sinonChai);

import MessageService from '../../src/services/MessageService';
import MessageRepository from '../../src/repositories/MessageRepository';

describe('MessageService', () => {
  describe('#createMessage', () => {
    it("should call MessageRepository#createMessage and resolve a responseObject with the message id, sender_id, receiver_id, date_sent, and contents", (done) => {
      // given
      const sender_id = "e56a16ab-abb8-4bb7-8132-e6b366df051a",
            receiver_id = "fdd518d8-2f94-48d3-9142-86915bd43498",
            contents = "New phone, who dis?",
            date_sent = "2017-01-23 22:25:38.344617",
            id = "e0ead320-2100-4746-b08d-5c02b3398726";
      const requestBody = {sender_id, receiver_id, contents};

      const resolved = {rows: [{sender_id, receiver_id, contents, date_sent, id}]};
      const messageRepository = new MessageRepository("FAKE_DB");
      // when
      const messageRepositoryStub = sinon.stub(messageRepository, "createMessage").withArgs(requestBody).resolves(resolved);
      const messageService = new MessageService(messageRepository);
      messageService.createMessage(requestBody)
        .then((result) => {
          // then
          result.should.deep.equal({sender_id, receiver_id, contents, date_sent, id});
          done();
        });
    });

  });
});
