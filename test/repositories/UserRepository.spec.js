import pg from 'pg';
import sinon from 'sinon';
import chai from 'chai';
chai.should();

import UserRepository from '../../repositories/UserRepository';

describe('UserRepository', () => {
  let userRepository, queryStub;
  beforeEach(() => {
    const PG_CLIENT = new pg.Client("FAKE_DB");
    queryStub = sinon.stub(PG_CLIENT, 'query');
    userRepository = new UserRepository(PG_CLIENT);
  });
  describe('#createUser', () => {
    it('should successfully create a user with correct insert and return query', () => {
      // given
      const name = "Sebastian";
      // when
      userRepository.createUser(name);
      // then
      queryStub.calledWith("INSERT INTO chat_api.user (name) VALUES ($1) RETURNING chat_api.user.id, chat_api.user.name;", [name]).should.equal.true;
    });
  });
});
