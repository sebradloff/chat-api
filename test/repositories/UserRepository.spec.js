import pg from 'pg';
import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.should();
chai.use(sinonChai);

import UserRepository from '../../repositories/UserRepository';

describe('UserRepository', () => {
  let userRepository, querySpy, PG_CLIENT;
  beforeEach(() => {
    PG_CLIENT = new pg.Client("postgresql://localhost/test_db");
    PG_CLIENT.connect();
    querySpy = sinon.spy(PG_CLIENT, 'query');
    userRepository = new UserRepository(PG_CLIENT);
  });
  afterEach(() => {
    PG_CLIENT.query('DELETE FROM chat_api.user;');
  });
  describe('#createUser', () => {
    it('should successfully create a user with correct insert and return query', (done) => {
      // given
      const name = "Sebastian";
      // when
      userRepository.createUser(name)
        .then((result) => {
          // then
          querySpy.should.have.been.calledWith("INSERT INTO chat_api.user (name) VALUES ($1) RETURNING chat_api.user.id, chat_api.user.name;", [name]);
          result.rowCount.should.equal(1);
          result.rows[0].should.include.keys('name', 'id');
          done();
        })
    });
  });
});
