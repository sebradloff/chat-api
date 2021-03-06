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

  getAllMessagesBetweenTwoUsers(userId1, userId2) {
    return new Promise((resolve, reject) => {
      this.pool.connect((err, client, done) => {
        if (err) reject('error fetching client from pool', err);

        client.query('SELECT chat_api.message.id, chat_api.message.contents, chat_api.message.receiver_id, ' +
                     'chat_api.message.sender_id, chat_api.message.date_sent ' +
                     'FROM chat_api.message ' +
                     'WHERE (chat_api.message.sender_id = $1 AND chat_api.message.receiver_id = $2) ' +
                     'OR (chat_api.message.sender_id = $2 AND chat_api.message.receiver_id = $1) ' +
                     'ORDER BY chat_api.message.date_sent DESC;',
                     [userId1, userId2],
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
