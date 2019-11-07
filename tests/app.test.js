/* global afterAll afterEach beforeAll beforeEach describe expect test */

const request = require('supertest');
const assert = require('assert');
const jsdom = require('jsdom');
const http = require('http');
const app = require('../app');

const { JSDOM } = jsdom;

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

afterAll((done) => {
  app.mongoose.connection.close()
    .then(server.close(done));
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
  test('They receive a 404 response for an invalid page', (done) => {
    agent
      .get('/pizza')
      .expect(404)
      .end(done);
  });

  test('They are redirected away from the homepage', (done) => {
    agent
      .get('/')
      .expect(302)
      .expect('Location', '/login')
      .end(done);
  });

  test('They can view the registration page', (done) => {
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

  test('They can view the login page', (done) => {
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

  test('They cannot view the feed page', (done) => {
    agent
      .get('/feed')
      .expect(302)
      .expect('Location', '/login')
      .end(done);
  });

  test('They cannot view the profile page', (done) => {
    agent
      .get('/profile')
      .expect(302)
      .expect('Location', '/login')
      .end(done);
  });

  test('They register using mock credentials', (done) => {
    agent
      .post('/register')
      .send({
        firstname: testFirstName,
        lastname: testLastName,
        email: testEmail1,
        password: testPasswordCorrect,
        username: testUsername1,
        image: testImage,
      })
      .expect(302)
      .expect('Location', '/login')
      .end(done);
  });

  test('They fail to register with a duplicate email address', (done) => {
    agent
      .post('/register')
      .send({
        firstname: testFirstName,
        lastname: testLastName,
        email: testEmail1,
        password: testPasswordCorrect,
        username: testUsername2,
        image: testImage,
      })
      .expect(302)
      // TODO: Add this kind of message elsewhere in app.js as well.
      .expect('Location', '/register?error=This%20user%20already%20exists')
      .end(done);
  });

  test('They fail to register with a duplicate username', (done) => {
    agent
      .post('/register')
      .send({
        firstname: testFirstName,
        lastname: testLastName,
        email: testEmail2,
        password: testPasswordCorrect,
        username: testUsername1,
        image: testImage,
      })
      .expect(302)
      .expect('Location', '/register?error=Please%20pick%20another%20username')
      .end(done);
  });

  test('They cannot get a user\'s info', (done) => {
    agent
      .get('/user')
      .expect(302)
      .expect('Location', '/login')
      .end(done);
  });

  test('They cannot delete a user', (done) => {
    agent
      .delete('/user')
      .expect(302)
      .expect('Location', '/login')
      .end(done);
  });

  test('They cannot get a list of users', (done) => {
    agent
      .get('/users')
      .expect(302)
      .expect('Location', '/login')
      .end(done);
  });

  test('They cannot log out', (done) => {
    agent
      .delete('/logout')
      .expect(302)
      .expect('Location', '/login')
      .end(done);
  });

  // TODO: This seems to overload the server.
  /*
  test('They cannot upload an image', (done) => {
    agent
      .post('/post')
      .attach('image', testImage)
      .expect(302)
      .end(done);
  });
  */

  test('They cannot see their profile picture', (done) => {
    agent
      .get(`/profile/${testEmail1}`)
      .expect(302)
      .expect('Location', '/login')
      .end(done);
  });

  test('They cannot log in using invalid credentials', (done) => {
    agent
      .post('/login')
      .send({
        email: testEmail1,
        password: testPasswordIncorrect,
      })
      .expect(302)
      .expect('Location', '/login')
      .end(done);
  });

  test('They can log in using valid credentials', (done) => {
    agent
      .post('/login')
      .send({
        email: testEmail1,
        password: testPasswordCorrect,
      })
      .expect(302)
      .expect('Location', '/')
      .end(done);
  });
});

describe('When a user is logged in', () => {
  // Log in before every test.
  beforeEach(async () => agent
    .post('/login')
    .send({
      email: testEmail1,
      password: testPasswordCorrect,
    })
    .expect(302));

  // After tests finish, delete the test user and their posts from the database.
  afterAll(async () => agent
    .delete('/user')
    .send({
      email: testEmail1,
    })
    .expect(200));

  test('They can get their user data', (done) => {
    agent.get('/user')
      .expect((res) => {
        assert.equal(res.body.email, testEmail1);
      })
      .end(done);
  });

  test('They cannot view the login page', (done) => {
    agent
      .get('/login')
      .expect(302)
      .expect('Location', '/')
      .end(done);
  });

  test('They cannot view the registration page', (done) => {
    agent
      .get('/register')
      .expect(302)
      .expect('Location', '/')
      .end(done);
  });

  test('They can view the feed page', (done) => {
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

  test('They can upload an image', (done) => {
    agent
      .post('/post')
      .attach('image', testImage)
      .expect(302)
      .expect('Location', '/feed')
      .end(done);
  });

  test('They can see their profile picture', (done) => {
    agent
      .get(`/profile/${testEmail1}`)
      .expect(200)
      .end(done);
  });
});
