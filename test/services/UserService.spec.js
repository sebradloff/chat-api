import pg from 'pg';
const Client = pg.Client;
import sinon from 'sinon';
require('sinon-as-promised');
import chai from 'chai';
import sinonChai from "sinon-chai";
chai.should();
chai.use(sinonChai);

import UserService from '../../src/services/UserService';
import UserRepository from '../../src/repositories/UserRepository';

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
    it("should throw an error when the name is left blank", (done) => {
      // given
      const blankName = "";
      const requestBody = {blankName};
      const errorMessage = 'Please provide a name field to create a user.';
      const userRepository = new UserRepository("FAKE_DB");
      // when
      const userService = new UserService(userRepository);
      userService.createUser(requestBody)
        .catch((error) => {
          // then
          error.should.equal(errorMessage);
          done();
        });
    });
    it("should throw an error when the name is undefined", () => {
      // given
      const requestBody = {};
      const errorMessage = 'Please provide a name field to create a user.';
      const userRepository = new UserRepository("FAKE_DB");
      // when
      const userService = new UserService(userRepository);
      userService.createUser(requestBody)
        .catch((error) => {
          // then
          error.should.equal(errorMessage);
          done();
        });
    });
  });
  describe("#getUser", () => {
    it("should call UserRepository#getUser and resolve an responseObject wiht id and name", (done) => {
      // give
      const name = "Sebastian", version4UUID = "c878b9ba-8e58-47ef-9598-6b0cea932b51";
      const resolved = {rows: [{name, id: version4UUID}]};
      const userRepository = new UserRepository("FAKE_DB");
      // when
      const userRepositoryStub = sinon.stub(userRepository, "getUser").withArgs(version4UUID).resolves(resolved);
      const userService = new UserService(userRepository);
      userService.getUser(version4UUID)
        .then((result) => {
          // then
          result.should.deep.equal({id: version4UUID, name});
          done();
        });
    });
    it("should throw an error when the id is NOT a valid uuid", (done) => {
      // given
      const invalidUUID = '123';
      const errorMessage = 'Please provide a valid id parameter to get a user.';
      const userRepository = new UserRepository("FAKE_DB");
      // when
      const userService = new UserService(userRepository);
      userService.getUser(invalidUUID)
        .catch((error) => {
          // then
          error.should.equal(errorMessage);
          done();
        });
    });
  });
  describe('#getAllUsers', () => {
    it('should call UserRepository#getAllUsers and resolve an responseObject array with two users', (done) => {
      // give
      const name1 = "Sebastian", id1 = "c878b9ba-8e58-47ef-9598-6b0cea932b51";
      const name2 = "Cool Dude", id2 = "0b7de571-88b6-4f12-a730-1b3c9df82a99";
      const resolved = { rows: [{ name: name1, id: id1 }, { name: name2, id: id2 }] };
      const userRepository = new UserRepository("FAKE_DB");
      // when
      sinon.stub(userRepository, 'getAllUsers').withArgs().resolves(resolved);
      const userService = new UserService(userRepository);
      userService.getAllUsers()
        .then((result) => {
          // then
          result.should.include.keys('users');
          result.users.length.should.equal(2);
          result.users[0].should.deep.equal({ name: name1, id: id1 });
          result.users[1].should.deep.equal({ name: name2, id: id2 });
          done();
        });
    });
  });
});
