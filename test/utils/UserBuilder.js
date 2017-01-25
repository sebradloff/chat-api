import uuid from 'node-uuid';
import PgPool from '../../src/PgPoolConfig';

class UserBuilder {
  constructor() {
    this.pool = PgPool;
  }

  createUser({ name, id }) {
    const userName = name || 'Very Cool Person';
    const userId = id || uuid.v4();
    return new Promise((resolve, reject) => {
      this.pool.connect((err, client, done) => {
        if(err) reject('error fetching client from pool', err);

        client.query("INSERT INTO chat_api.user (id, name) VALUES ($1, $2) " +
                 "RETURNING chat_api.user.id, chat_api.user.name;",
                  [userId, userName],
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
        if(err) reject('error fetching client from pool', err);

        client.query("DELETE FROM chat_api.user;",
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

export default UserBuilder;
