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
    it('should call MessageRepository#createMessage and resolve a responseObject with the message id, sender_id, receiver_id, date_sent, and contents', (done) => {
      // given
      const sender_id = "e56a16ab-abb8-4bb7-8132-e6b366df051a",
            receiver_id = "fdd518d8-2f94-48d3-9142-86915bd43498",
            contents = "New phone, who dis?",
            date_sent = "2017-01-23 22:25:38.344617",
            id = "e0ead320-2100-4746-b08d-5c02b3398726";
      const requestBody = { sender_id, receiver_id, contents };

      const resolved = { rows: [{ sender_id, receiver_id, contents, date_sent, id }] };
      const messageRepository = new MessageRepository('FAKE_DB');
      // when
      sinon.stub(messageRepository, 'createMessage').withArgs(requestBody).resolves(resolved);
      const messageService = new MessageService(messageRepository);
      messageService.createMessage(requestBody)
        .then((result) => {
          // then
          result.should.deep.equal({ sender_id, receiver_id, contents, date_sent, id });
          done();
        });
    });
    it('should error when sender_id is NOT a valid uuid', (done) => {
      const sender_id = 'NOT-REAL-UUID';
      const receiver_id = '2ea6c0eb-93c3-4dca-969e-2a159e0c9f04';
      const contents = 'Sup?';
      const requestBody = { sender_id, receiver_id, contents };
      const messageService = new MessageService('FAKE_REPOSITORY');
      messageService.createMessage(requestBody)
        .catch((error) => {
          // then
          error.should.deep.equal('Please provide a valid uuid for sender_id.');
          done();
        });
    });
    it('should error when receiver_id is NOT a valid uuid', (done) => {
      const sender_id = '2ea6c0eb-93c3-4dca-969e-2a159e0c9f04';
      const receiver_id = 'NOT-REAL-UUID';
      const contents = 'Sup?';
      const requestBody = { sender_id, receiver_id, contents };
      const messageService = new MessageService('FAKE_REPOSITORY');
      messageService.createMessage(requestBody)
        .catch((error) => {
          // then
          error.should.deep.equal('Please provide a valid uuid for receiver_id.');
          done();
        });
    });
    it('should error when contents is NOT in the request body', (done) => {
      const sender_id = '2ea6c0eb-93c3-4dca-969e-2a159e0c9f04';
      const receiver_id = '130c9872-b8bb-4ecd-b270-add6cd44a61d';
      const requestBody = { sender_id, receiver_id };
      const messageService = new MessageService('FAKE_REPOSITORY');
      messageService.createMessage(requestBody)
        .catch((error) => {
          // then
          error.should.deep.equal('Please provide some a contents key with your message!');
          done();
        });
    });
  });
  describe('#getAllMessagesBetweenTwoUsers', () => {
    it('should call MessageRepository#getAllMessagesBetweenTwoUsers and create an object with both users involved ids and their messages', (done) => {
      // given
      const userId1 = '130c9872-b8bb-4ecd-b270-add6cd44a61d';
      const userId2 = '2ea6c0eb-93c3-4dca-969e-2a159e0c9f04';
      const message1 = { contents: 'heyyyyy' };
      const message2 = { contents: 'yoooooo' };

      const resolved = { rows: [{ ...message1, ...message2 }] };
      const messageRepository = new MessageRepository('FAKE_DB');
      // when
      sinon.stub(messageRepository, 'getAllMessagesBetweenTwoUsers').withArgs(userId1, userId2).resolves(resolved);
      const messageService = new MessageService(messageRepository);
      messageService.getAllMessagesBetweenTwoUsers(userId1, userId2)
        .then((result) => {
          // then
          result.should.include.keys('userId1', 'userId2', 'messages');
          result.messages.should.deep.equal([{ ...message1, ...message2 }]);
          done();
        });
    });
    it('should error when userId1 is NOT a valid uuid with the correct error messages', (done) => {
      const userId1 = 'NOT-REAL-UUID';
      const userId2 = '2ea6c0eb-93c3-4dca-969e-2a159e0c9f04';

      const messageService = new MessageService('FAKE_REPOSITORY');
      messageService.getAllMessagesBetweenTwoUsers(userId1, userId2)
        .catch((error) => {
          // then
          error.should.deep.equal('Please provide a valid uuid for userId1.');
          done();
        });
    });
    it('should error when userId1 is NOT a valid uuid with the correct error messages', (done) => {
      const userId1 = '2ea6c0eb-93c3-4dca-969e-2a159e0c9f04';
      const userId2 = 'NOT-REAL-UUID';

      const messageService = new MessageService('FAKE_REPOSITORY');
      messageService.getAllMessagesBetweenTwoUsers(userId1, userId2)
        .catch((error) => {
          // then
          error.should.deep.equal('Please provide a valid uuid for userId2.');
          done();
        });
    });
  });
});
