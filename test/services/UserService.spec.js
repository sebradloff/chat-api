import pg from 'pg';
const Client = pg.Client;
import sinon from 'sinon';
require('sinon-as-promised');
import chai from 'chai';
import sinonChai from "sinon-chai";
chai.should();
chai.use(sinonChai);

import UserService from '../../services/UserService';
import UserRepository from '../../repositories/UserRepository';

describe('UserService', () => {
  describe('#createUser', () => {
    it("should call UserRepository#createUser and resolve an responseObject wiht id and name", (done) => {
      // given
      const name = "Sebastian", id = "fake-uuid";
      const requestBody = {name};
      const resolved = {rows: [{name, id}]};
      const userRepository = new UserRepository("FAKE_DB");
      // when
      const userRepositoryStub = sinon.stub(userRepository, "createUser").withArgs(name).resolves(resolved);
      const userService = new UserService(userRepository);
      userService.createUser(requestBody)
        .then((result) => {
          // then
          result.should.deep.equal({id, name});
          done();
        });
    });
  });
});
