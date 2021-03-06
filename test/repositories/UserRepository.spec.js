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
    return new UserBuilder().tearDown();
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
        });
    });
  });
  describe('#getUser', () => {
    let name, id, userBuilder;
    beforeEach(() => {
      name = 'Cool User', id = '1c4c9b7e-e1d6-11e6-bf01-fe55135034f3';
      userBuilder = new UserBuilder();
      return userBuilder.createUser({ name, id });
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
        });
    });
    it('should not find the user if they do not exist in the db', (done) => {
      // given
      const idNotInDB = 'bcf0df00-e1e4-11e6-bf01-fe55135034f3';
      // when
      userRepository.getUser(idNotInDB)
        .then((result) => {
          // then
          result.rowCount.should.equal(0);
          done();
        })
    });
  });
  describe('#getAllUsers', () => {
    let name1, name2, id1, id2, userBuilder;
    beforeEach(() => {
      name1 = 'Cool User 1', id1 = '1c4c9b7e-e1d6-11e6-bf01-fe55135034f3';
      name2 = 'Cool User 2', id2 = '0b7de571-88b6-4f12-a730-1b3c9df82a99';
      userBuilder = new UserBuilder();
      return (
        userBuilder.createUser({ name: name1, id: id1 })
          .then(() => {
            return userBuilder.createUser({ name: name2, id: id2 });
          })
      );
    });
    it('should return all user names and ids', (done) => {
      // when
      userRepository.getAllUsers()
        .then((result) => {
          // then
          result.rowCount.should.equal(2);
          result.rows[0].should.include.keys('name', 'id');
          done();
        });
    });
  });
});
