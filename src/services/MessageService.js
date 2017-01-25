import Promise from 'promise';
import uuidValidate from 'uuid-validate';

class MessageService {

  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }

  createMessage(requestBody) {
    const { sender_id, receiver_id, contents } = requestBody;
    return new Promise((resolve, reject) => {
      if (uuidValidate(sender_id, 4) === false) {
        reject('Please provide a valid uuid for sender_id.');
      } else if (uuidValidate(receiver_id, 4) === false) {
        reject('Please provide a valid uuid for receiver_id.');
      }

      if (contents === undefined) reject('Please provide some a contents key with your message!');
      this.messageRepository.createMessage({ sender_id, receiver_id, contents })
        .then((result) => {
          resolve(result.rows[0]);
        })
        .catch(error => reject(error));
    });
  }

  getAllMessagesBetweenTwoUsers(userId1, userId2) {
    return new Promise((resolve, reject) => {
      if (uuidValidate(userId1, 4) === false) {
        reject('Please provide a valid uuid for userId1.');
      } else if (uuidValidate(userId2, 4) === false) {
        reject('Please provide a valid uuid for userId2.');
      }
      this.messageRepository.getAllMessagesBetweenTwoUsers(userId1, userId2)
        .then((result) => {
          const messages = result.rows;
          resolve({ userId1, userId2, messages });
        })
        .catch(error => reject(error));
    });
  }

}

export default MessageService;
