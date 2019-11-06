/* global afterAll beforeAll beforeEach describe expect test */

const request = require('supertest');
const assert = require('assert');
const jsdom = require('jsdom');
const http = require('http');
const app = require('../app');

const { JSDOM } = jsdom;

const testFirstName = 'testFirstName';
const testLastName = 'testLastName';
const testUsername = 'testUsername';
const testEmail = 'testEmail@test.com';
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

afterAll((done) => {
  server.close(done);
});

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
      .type('text/ejs')
      .end((err, res) => {
        const dom = new JSDOM(res.text);
        const title = dom.window.document.getElementsByTagName('title')[0].innerHTML;
        assert(title === 'Login | Photogram');
        done();
      });
  });

  test('Loads registration page for them', (done) => {
    agent
      .get('/register')
      .expect(200)
      .end((err, res) => {
        const dom = new JSDOM(res.text);
        const title = dom.window.document.getElementsByTagName('title')[0].innerHTML;
        assert(title === 'Register | Photogram');
        done();
      });
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
        firstname: testFirstName,
        lastname: testLastName,
        email: testEmail,
        password: testPasswordCorrect,
        username: testUsername,
        image: testImage,
      })
      .expect(302)
      .end(done);
  });
});

describe('When a user is logged in', () => {
  // Log in before every test.
  beforeEach(async () => agent
    .post('/login')
    .send({
      email: testEmail,
      password: testPasswordCorrect,
    })
    .expect(302));

  // After tests finish, delete the test user and their posts from the database.
  afterAll(async () => agent
    .delete('/user')
    .send({
      email: testEmail,
    })
    .expect(200));

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
      .end((err, res) => {
        const dom = new JSDOM(res.text);
        const title = dom.window.document.getElementsByTagName('title')[0].innerHTML;
        assert(title === 'Feed | Photogram');
        done();
      });
  });

  test('Allows them to upload an image', (done) => {
    agent
      .post('/post')
      .attach('image', testImage)
      .expect(302)
      .end(done);
  });

  test('Lets them see their profile picture', (done) => {
    agent
      .get(`/profile/${testEmail}`)
      .expect(200)
      .end(done);
  });
});
