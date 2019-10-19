/* global afterAll expect test */

const request = require('supertest');
const app = require('../app');
const www = require('../bin/www');

// TODO: Figure out why this doesn't work.
afterAll((done) => {
  www.server.shutdown(done);
});

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

  expect(res.statusCode).toEqual(200);
});

test('Loads registration page for unauthenticated user', async () => {
  const res = await request(www.server).get('/register');

  expect(res.statusCode).toEqual(200);
});

test('Redirects unauthenticated user to login page', async () => {
  const res = await request(www.server).get('/');

  expect(res.statusCode).toEqual(302);
});

test('Returns 404 for invalid page', async () => {
  const res = await request(www.server).get('/pizza');

  expect(res.statusCode).toEqual(404);
});

/*
test('Registers a new user', async () => {
  // Register a mock user.
  const res = await request(www.server)
    .post('/register')
    .send({
      body: {
        name: 'Matt',
        email: 'getinthedamnbox@gmail.com',
        password: 'password',
      },
    });

  expect(res.statusCode).toEqual(200);
});
*/
