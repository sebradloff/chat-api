import Promise from 'promise';

class UserRepository {

  constructor(client) {
    this.client = client;
  }

  createUser(name) {
    return new Promise((resolve, reject) => {
      this.client
        .query("INSERT INTO chat_api.user (name) VALUES ($1) " +
               "RETURNING chat_api.user.id, chat_api.user.name;",
                [name],
              (error, result) => {
                if (error) reject(error);
                resolve(result);
              });
    });
  }

}

export default UserRepository;
