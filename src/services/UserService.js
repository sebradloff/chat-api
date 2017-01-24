import Promise from 'promise';
import uuidValidate from 'uuid-validate';

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
          resolve(result.rows[0]);
        });
    });
  }

  getUser(id) {
    return new Promise((resolve, reject) => {
      if (uuidValidate(id, 4) === false) reject('Please provide a valid id parameter to get a user.');

      this.userRepository.getUser(id)
        .then((result) => {
          resolve(result.rows[0]);
        });
    });
  }

}

export default UserService;
