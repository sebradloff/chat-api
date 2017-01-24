import Promise from 'promise';
import uuidValidate from 'uuid-validate';

class MessageService {

  constructor(messageRepository) {
    this.messageRepository = messageRepository;
  }

  createMessage(requestBody) {
    const {sender_id, receiver_id, contents} = requestBody;
    return new Promise((resolve, reject) => {
      this.messageRepository.createMessage({sender_id, receiver_id, contents})
        .then((result) => {
          resolve(result.rows[0]);
        });
    });
  }

}

export default MessageService;
