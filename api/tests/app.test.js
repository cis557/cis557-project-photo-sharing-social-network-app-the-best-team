/* global afterAll beforeAll beforeEach describe expect test */

const request = require('supertest');
const assert = require('assert');
const http = require('http');
const app = require('../app');
const User = require('../models/User');
const Post = require('../models/Post');

const testFirstName = 'testFirstName';
const testLastName = 'testLastName';
const testUsername1 = 'testUsername1';
const testUsername2 = 'testUsername2';
const testEmail1 = 'testEmail1@test.com';
const testEmail2 = 'testEmail2@test.com';
const testPasswordCorrect = 'correctPassword';
const testPasswordIncorrect = 'incorrectPassword';
const testImage = './tests/test.png';

let server;
let agent;

beforeAll((done) => {
  server = http.createServer(app.app);
  agent = request.agent(server);
  server.listen(done);
});

/*
afterAll((done) => {
  agent
    .delete('/deleteUser')
    .send({
      email: testEmail1,
    })
    .expect(200)
    .end(() => {
      app.mongoose.connection.close()
        .then(server.close(done));
    });
});
*/

afterAll((done) => {
  app.mongoose.connection.close()
    .then(server.close(done));
});

describe('Mock authentication tests', () => {
  test('Permits authenticated user to visit restricted page', () => {
    const req = { isAuthenticated: () => true };
    const res = {
      redirect: (string) => string,
      status: (code) => code,
    };
    res.status.json = (string) => string;
    const next = () => 'next';
    const authentication = app.checkAuthenticated(req, res, next);

    expect(authentication).toEqual('next');
  });

  test('Prevents unauthenticated user from visiting restricted page', () => {
    const req = { isAuthenticated: () => false };
    const jsonRes = { json: (string) => string };
    const res = {
      redirect: (string) => string,
      status: () => jsonRes,
    };
    const next = () => 'next';
    const authentication = app.checkAuthenticated(req, res, next);

    expect(authentication).toEqual('[!] Not authorized');
  });

  test('Prevents authenticated user from visiting unrestricted page', () => {
    const req = { isAuthenticated: () => true };
    const res = {
      redirect: (string) => string,
      status: (code) => code,
    };
    res.status.json = (string) => string;
    const next = () => 'next';
    const authentication = app.checkNotAuthenticated(req, res, next);

    expect(authentication).toEqual(200);
  });

  test('Permits unauthenticated user to visit unrestricted page', () => {
    const req = { isAuthenticated: () => false };
    const res = {
      redirect: (string) => string,
      status: (code) => code,
    };
    res.status.json = (string) => string;
    const next = () => 'next';
    const authentication = app.checkNotAuthenticated(req, res, next);

    expect(authentication).toEqual('next');
  });
});
