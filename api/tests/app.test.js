/* eslint-disable no-underscore-dangle */
/* global afterAll beforeAll describe expect test */

const request = require('supertest');
const assert = require('assert');
const http = require('http');
const async = require('async');
const { ObjectId } = require('mongoose').Types;
const app = require('../app');
const User = require('../models/User');
const Post = require('../models/Post');
const { mongoose } = require('../app');

const testFirstName = 'testFirstName';
const testLastName = 'testLastName';
const testUsername1 = 'testUsername1';
const testUsername2 = 'testUsername2';
const testUsername3 = 'testUsername3';
const testEmail1 = 'testEmail1@test.com';
const testEmail2 = 'testEmail2@test.com';
const testEmail3 = 'testEmail3@test.com';
const testPasswordCorrect = 'correctPassword';
const testPasswordIncorrect = 'incorrectPassword';

let testPostId;
let testCommentId;
const testTitle = 'Dummy title';
const testDescription = 'Dummy description';
const testPrivacy = 'public';
const testImage = './tests/test.png';
const testTags = 'getinthedamnbox';

let server;
let agent;

beforeAll((done) => {
  server = http.createServer(app.expressApp);
  agent = request.agent(server);
  server.listen(done);
});

afterAll((done) => {
  app.mongoose.connection.close()
    .then(server.close(done));
});

describe('Tests of core app.js functionality', () => {
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

describe('When a user is not logged in', () => {
  test('The API is active', (done) => {
    agent
      .get('/testAPI')
      .expect(200)
      .end(done);
  });

  test('They are rejected from accessing the /comment route', (done) => {
    agent
      .post('/comment')
      .expect(401)
      .end(done);
  });

  test('They are rejected from accessing the /follow route', (done) => {
    agent
      .post('/follow')
      .expect(401)
      .end(done);
  });

  test('They are rejected from accessing the /like route', (done) => {
    agent
      .post('/like')
      .expect(401)
      .end(done);
  });

  test('They are rejected from accessing the /getLikes route', (done) => {
    agent
      .get('/getLikes')
      .expect(401)
      .end(done);
  });

  test('They are rejected from accessing the /addPost route', (done) => {
    agent
      .post('/addPost')
      .expect(401)
      .end(done);
  });

  test('They are rejected from accessing the /editPost route', (done) => {
    agent
      .post('/editPost')
      .expect(401)
      .end(done);
  });

  test('They are rejected from accessing the /getFeed route', (done) => {
    agent
      .get('/getFeed')
      .expect(401)
      .end(done);
  });

  test('They are rejected from accessing the /getPost/:postId route', (done) => {
    agent
      .get('/getPost/0')
      .expect(401)
      .end(done);
  });

  test('They are rejected from accessing the /deletePost route', (done) => {
    agent
      .post('/deletePost')
      .expect(401)
      .end(done);
  });

  test('They are rejected from accessing the /getUser route', (done) => {
    agent
      .get('/getUser')
      .expect(401)
      .end(done);
  });

  test('They are rejected from accessing the /getOtherUser/:username route', (done) => {
    agent
      .get(`/getOtherUser/${testUsername1}`)
      .expect(401)
      .end(done);
  });

  test('They are rejected from accessing the /deleteUser route', (done) => {
    agent
      .delete('/deleteUser')
      .expect(401)
      .end(done);
  });

  test('They are rejected from accessing the /getSuggestedUsers route', (done) => {
    agent
      .get('/getSuggestedUsers')
      .expect(401)
      .end(done);
  });
});

describe('When a user is logged in ()', () => {
  // Register, log in, and prepare dummy data before running tests.
  beforeAll((done) => {
    async.series([
      (requestDone) => agent
        .post('/register')
        .send({
          firstName: testFirstName,
          lastName: testLastName,
          email: testEmail1,
          password: testPasswordCorrect,
          username: testUsername1,
          image: testImage,
        })
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/register')
        .send({
          firstName: testFirstName,
          lastName: testLastName,
          email: testEmail2,
          password: testPasswordCorrect,
          username: testUsername2,
          image: testImage,
        })
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/register')
        .send({
          firstName: testFirstName,
          lastName: testLastName,
          email: testEmail3,
          password: testPasswordCorrect,
          username: testUsername3,
          image: testImage,
        })
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/login')
        .send({
          email: testEmail1,
          password: testPasswordCorrect,
        })
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/addPost')
        .field('title', testTitle)
        .field('description', testDescription)
        .field('privacy', testPrivacy)
        .field('tags', testTitle)
        .attach('image', testImage)
        .expect(201)
        .then(() => { requestDone(); }),
      (requestDone) => Post
        .findOne({ username: testUsername1 })
        .then((post) => { testPostId = post._id; })
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/comment')
        .send({
          postId: testPostId,
          text: 'Dummy comment text',
          method: 'add',
        })
        .expect(201)
        .then(() => { requestDone(); }),
      (requestDone) => Post
        .findOne({ _id: ObjectId(testPostId) })
        .then((post) => { testCommentId = post.comments[0]._id; })
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/follow')
        .send({
          username: testUsername3,
          method: 'follow',
        })
        .expect(200)
        .then(() => { requestDone(); }),
    ], done);
  });

  afterAll((done) => {
    User
      .deleteMany(
        {
          $or: [
            { username: testUsername1 },
            { username: testUsername2 },
            { username: testUsername3 },
          ],
        },
      )
      .then(() => { Post.deleteMany({ username: testUsername1 }).then(done); });
  });

  test('The API is active', (done) => {
    agent
      .get('/testAPI')
      .expect(200)
      .end(done);
  });

  test('The user can comment on a post', (done) => {
    agent
      .post('/comment')
      .send({
        postId: testPostId,
        text: 'Dummy comment text',
        method: 'add',
      })
      .expect(201)
      .end(done);
  });

  test('The user can edit a comment', (done) => {
    agent
      .post('/comment')
      .send({
        postId: testPostId,
        commentId: testCommentId,
        text: 'Dummy comment text',
        method: 'edit',
      })
      .expect(200)
      .end(done);
  });

  test('The user can delete a comment', (done) => {
    agent
      .post('/comment')
      .send({
        postId: testPostId,
        commentId: testCommentId,
        method: 'delete',
      })
      .expect(200)
      .end(done);
  });

  test('The user can follow another user', (done) => {
    agent
      .post('/follow')
      .send({
        username: testUsername2,
        method: 'follow',
      })
      .expect(200)
      .end(done);
  });

  test('The user can unfollow another user', (done) => {
    agent
      .post('/follow')
      .send({
        username: testUsername3,
        method: 'unfollow',
      })
      .expect(200)
      .end(done);
  });
});
