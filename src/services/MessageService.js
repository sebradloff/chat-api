import Promise from 'promise';

class MessageService {

  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }

  createMessage(requestBody) {
    const { sender_id, receiver_id, contents } = requestBody;
    return new Promise((resolve, reject) => {
      this.messageRepository.createMessage({ sender_id, receiver_id, contents })
        .then((result) => {
          resolve(result.rows[0]);
        })
        .catch(error => reject(error));
    });
  }

  getAllMessagesBetweenTwoUsers(userId1, userId2) {
    return new Promise((resolve, reject) => {
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
