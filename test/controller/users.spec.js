import supertest from 'supertest';
import express from 'express';
import chai from 'chai';
chai.should();

const app = supertest.agent('http://localhost:8080');

describe('users', () => {
  describe('#createUser', () => {
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
          res.body.should.include.keys('name');
          res.body.should.include.keys('id');
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
    it('should NOT create a user if the name key is a blank string', (done) => {
      app
        .post('/users')
        .send({ name: '' })
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
});
