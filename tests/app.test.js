/* global afterAll beforeAll beforeEach describe expect test */

const request = require('supertest');
const fs = require('fs');
const mockFs = require('mock-fs');
const assert = require('assert');
const app = require('../app');
const www = require('../bin/www');

const agent = request.agent(www.server);

// TODO: Figure out why this doesn't work.
afterAll((done) => {
  mockFs.restore();
  www.server.shutdown(done);
});

const testName = 'testName';
const testEmail = 'testEmail@test.com';
const testPasswordCorrect = 'correctPassword';
const testPasswordIncorrect = 'incorrectPassword';

describe('Mock authentication tests', () => {
  test('Permits authenticated user to visit restricted page', () => {
    const req = { isAuthenticated: () => true };
    const res = { redirect: (string) => string };
    const next = () => 'next';
    const authentication = app.checkAuthenticated(req, res, next);

    expect(authentication).toEqual('next');
  });

  test('Prevents unauthenticated user from visiting restricted page', () => {
    const req = { isAuthenticated: () => false };
    const res = { redirect: (string) => string };
    const next = () => 'next';
    const authentication = app.checkAuthenticated(req, res, next);

    expect(authentication).toEqual('/login');
  });

  test('Prevents authenticated user from visiting unrestricted page', () => {
    const req = { isAuthenticated: () => true };
    const res = { redirect: (string) => string };
    const next = () => 'next';
    const authentication = app.checkNotAuthenticated(req, res, next);

    expect(authentication).toEqual('/');
  });

  test('Permits unauthenticated user to visit unrestricted page', () => {
    const req = { isAuthenticated: () => false };
    const res = { redirect: (string) => string };
    const next = () => 'next';
    const authentication = app.checkNotAuthenticated(req, res, next);

    expect(authentication).toEqual('next');
  });
});

describe('When a user is not logged in', () => {
  test('Loads login page for them', (done) => {
    agent
      .get('/login')
      .expect(200)
      .end(done);
  });

  test('Loads registration page for them', (done) => {
    agent
      .get('/register')
      .expect(200)
      .end(done);
  });

  test('Redirects them to login page', (done) => {
    agent
      .get('/')
      .expect(302)
      .end(done);
  });

  test('Returns 404 for invalid page', (done) => {
    agent
      .get('/pizza')
      .expect(404)
      .end(done);
  });

  test('Registers using mock credentials', (done) => {
    agent
      .post('/register')
      .send({
        name: testName,
        email: testEmail,
        password: testPasswordCorrect,
      })
      .expect(302)
      .end(done);
  });
});

describe('When a user is logged in', () => {
  beforeEach(async () => agent
    .post('/login')
    .send({
      email: testEmail,
      password: testPasswordCorrect,
    })
    .expect(302));

  test('Fetches their data from the server', (done) => {
    agent.get('/user')
      .expect((res) => {
        assert.equal(res.body.email, testEmail);
      })
      .end(done);
  });

  test('Redirects them away from login page', (done) => {
    agent
      .get('/login')
      .expect(302)
      .end(done);
  });

  test('Redirects them away from registration page', (done) => {
    agent
      .get('/register')
      .expect(302)
      .end(done);
  });

  test('Loads feed page for them', (done) => {
    agent
      .get('/feed')
      .expect(200)
      .end(done);
  });

  test('Allows them to upload an image', (done) => {
    const testImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAANSURBVBhXY2BwS/0PAAKgAaunBFbvAAAAAElFTkSuQmCC';

    mockFs({
      'test.png': testImg,
    });

    const img = fs.readFileSync('test.png');

    agent
      .post('/post')
      .attach('image', img)
      .expect(302)
      .end(done);
  });
});
