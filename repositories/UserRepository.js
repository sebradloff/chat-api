class UserRepository {

  constructor(client) {
    this.client = client;
  }

  createUser(name) {
    return this.client
      .query("INSERT INTO chat_api.user (name) VALUES ($1) " +
             "RETURNING chat_api.user.id, chat_api.user.name;",
              [name]);
  }

}

export default UserRepository;
