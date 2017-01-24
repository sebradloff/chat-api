import Promise from 'promise';

class UserService {

  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  createUser(requestBody) {
    const name = requestBody.name;
    return new Promise((resolve, reject) => {
      if (name === '' || name === undefined) reject('Please provide a name field to create a user.');

      this.userRepository.createUser(name)
        .then((result) => {
          const id = result.rows[0].id;
          const name = result.rows[0].name;
          resolve({id, name});
        });
    });
  }

}

export default UserService;
