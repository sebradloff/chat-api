import Promise from 'promise';

class MessageRepository {

  constructor(pool) {
    this.pool = pool;
  }

  createMessage({ contents, sender_id, receiver_id }) {
    return new Promise((resolve, reject) => {
      this.pool.connect((err, client, done) => {
        if (err) reject('error fetching client from pool', err);

        client.query('INSERT INTO chat_api.message (contents, sender_id, receiver_id) ' +
                     'VALUES ($1, $2, $3) ' +
                     'RETURNING chat_api.message.id, chat_api.message.contents, chat_api.message.receiver_id, ' +
                     'chat_api.message.sender_id, chat_api.message.date_sent;',
                     [contents, sender_id, receiver_id],
                     (error, result) => {
                       if (error) reject(error);
                       resolve(result);
                       done();
                     });
      });
    });
  }

}

export default MessageRepository;
