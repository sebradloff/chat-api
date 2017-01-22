import supertest from 'supertest';
import express from 'express';
import chai from 'chai';
chai.should();

const app = supertest.agent('http://localhost:8080');

describe('users', () => {
    it('should create a user and return the user name and id', (done) => {
      const name = 'Sebastian';
      app
        .post('/users')
        .send({ name })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.include.keys('name');
          res.body.should.include.keys('id');
          res.body.name.should.equal(name);
          done();
        });
    });
});
