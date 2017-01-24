import PgPool from '../../src/PgPoolConfig';
import uuid from 'node-uuid';

class UserBuilder {
  constructor({name, id}) {
    this.name = name || 'Very Cool Person';
    this.id = id || uuid.v4();
    this.pool = PgPool;
  }

  getUserInfo() {
    return {name: this.name, id: this.id};
  }

  createUser() {
    return new Promise((resolve, reject) => {
      this.pool.connect((err, client, done) => {
        if(err) reject('error fetching client from pool', err);

        client.query("INSERT INTO chat_api.user (id, name) VALUES ($1, $2) " +
                 "RETURNING chat_api.user.id, chat_api.user.name;",
                  [this.id, this.name],
                (error, result) => {
                  if (error) reject(error);
                  console.log("initial insert", result.rows)
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
