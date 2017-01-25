import Promise from 'promise';

class UserRepository {

  constructor(pool) {
    this.pool = pool;
  }

  createUser(name) {
    return new Promise((resolve, reject) => {
      this.pool.connect((err, client, done) => {
        if (err) reject('error fetching client from pool', err);

        client.query('INSERT INTO chat_api.user (name) VALUES ($1) ' +
                 'RETURNING chat_api.user.id, chat_api.user.name;',
                  [name],
                (error, result) => {
                  if (error) reject(error);
                  resolve(result);
                  done();
                });
      });
    });
  }

  getUser(id) {
    return new Promise((resolve, reject) => {
      this.pool.connect((err, client, done) => {
        if (err) reject('error fetching client from pool', err);

        client.query('SELECT chat_api.user.id, chat_api.user.name FROM chat_api.user WHERE chat_api.user.id = $1;',
                  [id],
                (error, result) => {
                  if (error) reject(error);
                  resolve(result);
                  done();
                });
      });
    });
  }

  getAllUsers() {
    return new Promise((resolve, reject) => {
      this.pool.connect((err, client, done) => {
        if (err) reject('error fetching client from pool', err);

        client.query('SELECT chat_api.user.id, chat_api.user.name FROM chat_api.user;',
                  [],
                (error, result) => {
                  if (error) reject(error);
                  resolve(result);
                  done();
                });
      });
    });
  }

}

export default UserRepository;
