import uuid from 'node-uuid';
import moment from 'moment';
import PgPool from '../../src/PgPoolConfig';

class MessageBuilder {
  constructor() {
    this.pool = PgPool;
  }

  createMessage({ id, contents, date_sent, sender_id, receiver_id }) {
    const messageId = id || uuid.v4();
    const messageContents = contents || 'New phone, who dis?';
    const messsageDateSent = date_sent || moment().format();
    const messageSenderId = sender_id || uuid.v4();
    const messageReceiverId = receiver_id || uuid.v4();

    return new Promise((resolve, reject) => {
      this.pool.connect((err, client, done) => {
        if (err) reject('error fetching client from pool', err);

        client.query('INSERT INTO chat_api.message (id,contents,date_sent,sender_id,receiver_id) ' +
                     'VALUES ($1, $2, $3, $4, $5) ' +
                     'RETURNING chat_api.message.id, chat_api.message.contents, chat_api.message.receiver_id, ' +
                     'chat_api.message.sender_id, chat_api.message.date_sent;',
                  [messageId, messageContents, messsageDateSent, messageSenderId, messageReceiverId],
                (error, result) => {
                  if (error) reject(error);
                  resolve(result);
                  done();
                });
      });
    });
  }

  tearDown() {
    return new Promise((resolve, reject) => {
      this.pool.connect((err, client, done) => {
        if (err) reject('error fetching client from pool', err);

        client.query('DELETE FROM chat_api.message;',
                  [],
                (error, result) => {
                  done();
                  if (error) reject(error);
                  resolve(result);
                });
      });
    });
  }

}

export default MessageBuilder;
