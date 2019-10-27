/* global afterAll expect test */

const request = require('supertest');
const app = require('../app');
const www = require('../bin/www');

// TODO: Figure out why this doesn't work.
afterAll((done) => {
  www.server.shutdown(done);
});

const testName = 'testName';
const testEmail = 'testEmail@test.com';
const testPasswordCorrect = 'correctPassword';
const testPasswordIncorrect = 'incorrectPassword';

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

test('Loads login page for unauthenticated user', async () => {
  const res = await request(www.server).get('/login');

  expect(res.status).toEqual(200);
});

test('Loads registration page for unauthenticated user', async () => {
  const res = await request(www.server).get('/register');

  expect(res.status).toEqual(200);
});

test('Redirects unauthenticated user to login page', async () => {
  const res = await request(www.server).get('/');

  expect(res.status).toEqual(302);
});

test('Returns 404 for invalid page', async () => {
  const res = await request(www.server).get('/pizza');

  expect(res.status).toEqual(404);
});

test('Registers using mock credentials', async () => {
  const res = await request(www.server)
    .post('/register')
    .send({
      name: testName,
      email: testEmail,
      password: testPasswordCorrect,
    });

  expect(res.status).toEqual(302);
});

test('Rejects login using invalid mock credentials', async () => {
  const res = await request(www.server)
    .post('/login')
    .send({
      name: testName,
      email: testEmail,
      password: testPasswordIncorrect,
    });

  expect(res.status).toEqual(302);
});

test('Accepts login using valid mock credentials', async () => {
  request(www.server)
    .post('/login')
    .send({
      name: testName,
      email: testEmail,
      password: testPasswordCorrect,
    });

  request(www.server)
    .get('/user')
    .then((user) => expect(user).toEqual(testEmail));
});
