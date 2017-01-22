import supertest from 'supertest';
import express from 'express';
import chai from 'chai';
chai.should();

const app = supertest.agent('http://localhost:8080');

describe('hello', () => {
    it('should return a message of hello', (done) => {
      app
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.deep.equal({ message: 'hello' });
          done();
        });
    });
});
