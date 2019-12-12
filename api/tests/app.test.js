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
const testUsername4 = 'testUsername4';
const testUsername5 = 'testUsername5';
const testEmail1 = 'testEmail1@test.com';
const testEmail2 = 'testEmail2@test.com';
const testEmail3 = 'testEmail3@test.com';
const testEmail4 = 'testEmail4@test.com';
const testEmail5 = 'testEmail5@test.com';
const testPasswordCorrect = 'correctPassword';
const testPasswordIncorrect = 'incorrectPassword';

let testPostId1;
let testPostId2;
let testPostId3;
let testCommentId;
const testTitle1 = 'Test title 1';
const testTitle2 = 'Test title 2';
const testTitle3 = 'Test title 3';
const testTitle4 = 'Test title 4';
const testDescription = 'Test description';
const testPrivacy = 'public';
const testImage = './tests/test.png';
const testTags = 'getinthedamnbox';
const testCommentText = 'Test text';

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

  test('They can register an account', (done) => {
    agent
      .post('/register')
      .send({
        firstName: testFirstName,
        lastName: testLastName,
        email: testEmail1,
        password: testPasswordCorrect,
        username: testUsername1,
        image: testImage,
      })
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
        .post('/register')
        .send({
          firstName: testFirstName,
          lastName: testLastName,
          email: testEmail4,
          password: testPasswordCorrect,
          username: testUsername4,
          image: testImage,
        })
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/register')
        .send({
          firstName: testFirstName,
          lastName: testLastName,
          email: testEmail5,
          password: testPasswordCorrect,
          username: testUsername5,
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
        .field('title', testTitle1)
        .field('description', testDescription)
        .field('privacy', testPrivacy)
        .field('tags', testTags)
        .attach('image', testImage)
        .expect(201)
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/addPost')
        .field('title', testTitle2)
        .field('description', testDescription)
        .field('privacy', testPrivacy)
        .field('tags', testTags)
        .attach('image', testImage)
        .expect(201)
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/addPost')
        .field('title', testTitle3)
        .field('description', testDescription)
        .field('privacy', testPrivacy)
        .field('tags', testTags)
        .attach('image', testImage)
        .expect(201)
        .then(() => { requestDone(); }),
      (requestDone) => Post
        .findOne({ title: testTitle1 })
        .then((post) => { testPostId1 = post._id; })
        .then(() => { requestDone(); }),
      (requestDone) => Post
        .findOne({ title: testTitle2 })
        .then((post) => { testPostId2 = post._id; })
        .then(() => { requestDone(); }),
      (requestDone) => Post
        .findOne({ title: testTitle3 })
        .then((post) => { testPostId3 = post._id; })
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/comment')
        .send({
          postId: testPostId1,
          text: 'Dummy comment text',
          method: 'add',
        })
        .expect(201)
        .then(() => { requestDone(); }),
      (requestDone) => Post
        .findOne({ _id: ObjectId(testPostId1) })
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
      (requestDone) => agent
        .post('/follow')
        .send({
          username: testUsername4,
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

  test('They can comment on a post', (done) => {
    agent
      .post('/comment')
      .send({
        postId: testPostId1,
        text: testCommentText,
        method: 'add',
      })
      .expect(201)
      .end(done);
  });

  test('They can edit a comment', (done) => {
    agent
      .post('/comment')
      .send({
        postId: testPostId1,
        commentId: testCommentId,
        text: testCommentText,
        method: 'edit',
      })
      .expect(200)
      .end(done);
  });

  test('They can delete a comment', (done) => {
    agent
      .post('/comment')
      .send({
        postId: testPostId1,
        commentId: testCommentId,
        method: 'delete',
      })
      .expect(200)
      .end(done);
  });

  test('They cannot make a malformed comment request', (done) => {
    agent
      .post('/comment')
      .send({
        postId: testPostId1,
        commentId: testCommentId,
        method: 'malformed',
      })
      .expect(400)
      .end(done);
  });

  test('They can follow another user', (done) => {
    agent
      .post('/follow')
      .send({
        username: testUsername2,
        method: 'follow',
      })
      .expect(200)
      .end(done);
  });

  test('They cannot follow a user they already follow', (done) => {
    agent
      .post('/follow')
      .send({
        username: testUsername4,
        method: 'follow',
      })
      .expect(400)
      .end(done);
  });

  test('They can unfollow another user', (done) => {
    agent
      .post('/follow')
      .send({
        username: testUsername3,
        method: 'unfollow',
      })
      .expect(200)
      .end(done);
  });

  test('They cannot unfollow a user they do not follow', (done) => {
    agent
      .post('/follow')
      .send({
        username: testUsername5,
        method: 'unfollow',
      })
      .expect(400)
      .end(done);
  });

  test('They cannot make a malformed follow request', (done) => {
    agent
      .post('/follow')
      .send({
        username: testUsername5,
        method: 'malformed',
      })
      .expect(400)
      .end(done);
  });

  test('They can like a post', (done) => {
    agent
      .post('/like')
      .send({
        postId: testPostId1,
        method: 'add',
      })
      .expect(201)
      .end(done);
  });

  test('They can unlike a post', (done) => {
    agent
      .post('/like')
      .send({
        postId: testPostId2,
        method: 'remove',
      })
      .expect(200)
      .end(done);
  });

  test('They cannot make a malformed like request', (done) => {
    agent
      .post('/like')
      .send({
        postId: testPostId1,
        method: 'malformed',
      })
      .expect(400)
      .end(done);
  });

  test('They can get their liked posts', (done) => {
    agent
      .get('/getLikes')
      .expect(200)
      .end(done);
  });

  test('They can add a post', (done) => {
    agent
      .post('/addPost')
      .field('title', testTitle4)
      .field('description', testDescription)
      .field('privacy', testPrivacy)
      .field('tags', testTags)
      .attach('image', testImage)
      .expect(201)
      .end(done);
  });

  test('They can edit a post', (done) => {
    agent
      .post('/editPost')
      .send({
        postId: testPostId2,
        title: testTitle2,
        description: testDescription,
      })
      .expect(200)
      .end(done);
  });

  test('They can get their feed', (done) => {
    agent
      .get('/getFeed')
      .expect(200)
      .end(done);
  });

  test('They can get a post', (done) => {
    agent
      .get(`/getPost/${testPostId2}`)
      .expect(200)
      .end(done);
  });

  test('They can delete a post', (done) => {
    agent
      .post('/deletePost')
      .send({
        postId: testPostId3,
      })
      .expect(200)
      .end(done);
  });

  test('They can get their own profile data', (done) => {
    agent
      .get('/getUser')
      .expect(200)
      .end(done);
  });

  test('They can get the profile data of another user', (done) => {
    agent
      .get(`/getOtherUser/${testUsername2}`)
      .expect(200)
      .end(done);
  });
});
