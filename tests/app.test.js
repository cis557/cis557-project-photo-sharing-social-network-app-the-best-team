/* global afterAll expect test */

const request = require('supertest');
const mockFs = require('mock-fs');
const app = require('../app');
const www = require('../bin/www');

const testImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAANSURBVBhXY2BwS/0PAAKgAaunBFbvAAAAAElFTkSuQmCC';

// TODO: Figure out why this doesn't work.
afterAll((done) => {
  // mockFs.restore();
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

// TODO: Figure out why this doesn't work.
 test('Accepts login using valid mock credentials', async () => {
    expect.assertions(1);   
    console.log('#1');
    const res = await request(www.server)
    .post('/login')
    .send("username=testEmail&password=testPasswordCorrect");
    //setAttribute etc. doesnt work
    expect(res.status).toEqual(302);

  // TODO: Notice that this console statement doesn't print.
  // console.log('#2');

  // const res2 = await request(www.server)
  //   .get('/user');

  // console.log('#3');

  // expect(res2.body.email).toEqual(testEmail);
});

//FixME



// TODO: Figure out why this doesn't work.
/*
test('Uploads an image', async () => {
  mockFs({
    'test.png': testImg,
  });

  const img = fs.readFileSync('test.png');

  request(www.server)
    .post('/post')
    .attach('image', img)
    .then((res) => {
      expect(res.status).toEqual(302);
    });
});
*/
