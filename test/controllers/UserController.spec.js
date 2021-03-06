import supertest from 'supertest';
import express from 'express';
import UserBuilder from '../utils/UserBuilder';
import chai from 'chai';
chai.should();

const app = supertest.agent('http://localhost:8080');

describe('UserController', () => {
  describe('post to /users', () => {
    it('should create a user and return the user name and id', (done) => {
      const name = 'Sebastian';
      app
        .post('/users')
        .send({ name })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.include.keys('name', 'id');
          res.body.name.should.equal(name);
          done();
        });
    });
    it('should NOT create a user if name key is missing on the post', (done) => {
      app
        .post('/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.include.keys('error');
          res.body.error.should.equal('Please provide a name field to create a user.');
          done();
        });
    });
  });
  describe('get /users/:id', () => {
    let name, id, userBuilder;
    beforeEach(() => {
      name = 'Cool User', id = 'e7b3d736-49c2-4297-998f-4e2fb8c2784e';
      userBuilder = new UserBuilder();
      return userBuilder.createUser({ name, id });
    });
    afterEach(() => {
      return userBuilder.tearDown();
    });
    it("should return a user's name and id", (done) => {
      const url = encodeURI(`/users/${id}`);
      app
        .get(url)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.include.keys('name', 'id');
          res.body.name.should.equal(name);
          res.body.id.should.equal(id);
          done();
        });
    });
    it("should NOT return a user's name and id if the id is NOT a UUID", (done) => {
      app
        .get('/users/123')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.include.keys('error');
          res.body.error.should.equal('Please provide a valid id parameter to get a user.');
          done();
        });
    });
  });
  describe('get /users', () => {
    let userBuilder;
    beforeEach(() => {
      const name1 = 'Cool User', id1 = 'e7b3d736-49c2-4297-998f-4e2fb8c2784e';
      const name2 = 'Cool User 2', id2 = '0b7de571-88b6-4f12-a730-1b3c9df82a99';
      userBuilder = new UserBuilder();
      return (
        userBuilder.createUser({ name: name1, id: id1 })
          .then(() => {
            userBuilder.createUser({ name: name2, id: id2 });
          })
      );
    });
    afterEach(() => {
      return userBuilder.tearDown();
    });
    it('should get ALL users names and ids', (done) => {
      app
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.should.include.keys('users');
          res.body.users.length.should.equal(2);
          done();
        });
    });
  });
});
