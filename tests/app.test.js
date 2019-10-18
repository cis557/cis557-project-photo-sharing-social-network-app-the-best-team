/* global expect test */

const testApp = require('../app');

test('Correctly permits authenticated user to visit restricted page', () => {
  const req = { isAuthenticated: () => true };
  const res = { redirect: (string) => string };
  const next = () => 'next';
  const authentication = testApp.checkAuthenticated(req, res, next);

  expect(authentication).toEqual('next');
});

test('Correctly prevents unauthenticated user from visiting restricted page', () => {
  const req = { isAuthenticated: () => false };
  const res = { redirect: (string) => string };
  const next = () => 'next';
  const authentication = testApp.checkAuthenticated(req, res, next);

  expect(authentication).toEqual('/login');
});

test('Correctly prevents authenticated user from visiting unrestricted page', () => {
  const req = { isAuthenticated: () => true };
  const res = { redirect: (string) => string };
  const next = () => 'next';
  const authentication = testApp.checkNotAuthenticated(req, res, next);

  expect(authentication).toEqual('/');
});

test('Correctly permits unauthenticated user to visit unrestricted page', () => {
  const req = { isAuthenticated: () => false };
  const res = { redirect: (string) => string };
  const next = () => 'next';
  const authentication = testApp.checkNotAuthenticated(req, res, next);

  expect(authentication).toEqual('next');
});
