/* global afterAll beforeAll expect test */

const request = require('supertest');
const http = require('http');
const script = require('../app');

let server;

beforeAll((done) => {
  server = http.createServer((req, res) => {
    res.write('ok');
    res.end();
  });
  server.listen(done);
});

afterAll((done) => {
  server.close(done);
});

test('Permits authenticated user to visit restricted page', () => {
  const req = { isAuthenticated: () => true };
  const res = { redirect: (string) => string };
  const next = () => 'next';
  const authentication = script.checkAuthenticated(req, res, next);

  expect(authentication).toEqual('next');
});

test('Prevents unauthenticated user from visiting restricted page', () => {
  const req = { isAuthenticated: () => false };
  const res = { redirect: (string) => string };
  const next = () => 'next';
  const authentication = script.checkAuthenticated(req, res, next);

  expect(authentication).toEqual('/login');
});

test('Prevents authenticated user from visiting unrestricted page', () => {
  const req = { isAuthenticated: () => true };
  const res = { redirect: (string) => string };
  const next = () => 'next';
  const authentication = script.checkNotAuthenticated(req, res, next);

  expect(authentication).toEqual('/');
});

test('Permits unauthenticated user to visit unrestricted page', () => {
  const req = { isAuthenticated: () => false };
  const res = { redirect: (string) => string };
  const next = () => 'next';
  const authentication = script.checkNotAuthenticated(req, res, next);

  expect(authentication).toEqual('next');
});

test('Loads login page for unauthenticated user', async () => {
  const res = await request(server).get('/login');
  expect(res.statusCode).toEqual(200);
});
