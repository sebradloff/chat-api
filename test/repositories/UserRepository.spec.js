import pg from 'pg';
import sinon from 'sinon';
import PgPool from '../../src/PgPoolConfig';
import UserBuilder from '../utils/UserBuilder';
import chai from 'chai';
import sinonChai from 'sinon-chai';
chai.should();
chai.use(sinonChai);

import UserRepository from '../../src/repositories/UserRepository';

describe('UserRepository', () => {
  let userRepository;
  beforeEach(() => {
    userRepository = new UserRepository(PgPool);
  });
  afterEach(() => {
    return new UserBuilder({}).tearDown();
  });
  describe('#createUser', () => {
    it('should successfully create a user return name and id', (done) => {
      // given
      const name = "Sebastian";
      // when
      userRepository.createUser(name)
        .then((result) => {
          // then
          result.rowCount.should.equal(1);
          result.rows[0].should.include.keys('name', 'id');
          done();
        })
    });
  });
  describe('#getUser', () => {
    let name, id, userBuilder;
    beforeEach(() => {
      name = 'Cool User', id = '1c4c9b7e-e1d6-11e6-bf01-fe55135034f3';
      userBuilder = new UserBuilder({name, id});
      return userBuilder.createUser();
    });
    it('should successfully get user by id with correct query', (done) => {
      // when
      userRepository.getUser(id)
        .then((result) => {
          // then
          result.rowCount.should.equal(1);
          result.rows[0].should.include.keys('name', 'id');
          result.rows[0].name.should.equal(name);
          result.rows[0].id.should.equal(id);
          done();
        })
    });
  });
});
