/* eslint-disable no-underscore-dangle */

const request = require('supertest');
const http = require('http');
const async = require('async');
const { ObjectId } = require('mongoose').Types;
const app = require('../app');
const User = require('../models/User');
const Post = require('../models/Post');

const testFirstName = 'testFirstName';
const testLastName = 'testLastName';
const testUsername1 = 'testUsername1';
const testUsername2 = 'testUsername2';
const testUsername3 = 'testUsername3';
const testUsername4 = 'testUsername4';
const testUsername5 = 'testUsername5';
const testUsername6 = 'testUsername6';
const testUsername7 = 'testUsername7';
const testUsername8 = 'testUsername8';
const testUsername9 = 'testUsername9';
const testUsername10 = 'testUsername10';
const testUsernameIncorrect = 'testUsernameIncorrect';
const testEmail1 = 'testEmail1@test.com';
const testEmail2 = 'testEmail2@test.com';
const testEmail3 = 'testEmail3@test.com';
const testEmail4 = 'testEmail4@test.com';
const testEmail5 = 'testEmail5@test.com';
const testEmail6 = 'testEmail6@test.com';
const testEmail7 = 'testEmail7@test.com';
const testEmail8 = 'testEmail8@test.com';
const testEmail9 = 'testEmail9@test.com';
const testEmail10 = 'testEmail10@test.com';
const testPasswordCorrect = 'correctPassword';
const testPasswordIncorrect = 'incorrectPassword';

let testPostId1;
let testPostId2;
let testPostId3;
const testPostIdIncorrect = ObjectId(9999);
let testCommentId;
const testTitle1 = 'Test title 1';
const testTitle2 = 'Test title 2';
const testTitle3 = 'Test title 3';
const testTitle4 = 'Test title 4';
const testDescription = 'Test description';
const testPrivacy = 'public';
const testImageValid = './tests/testValid.png';
const testImageInvalid = './tests/testInvalid.jpg';
const testFileInvalid = './tests/testInvalid.txt';
const testTags = 'getinthedamnbox';
const testCommentText = 'Test comment text';
const testLongText = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit,
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Et netus et malesuada fames. Amet luctus venenatis lectus magna fringilla urna
porttitor rhoncus. Cursus vitae congue mauris rhoncus aenean.
Platea dictumst quisque sagittis purus sit amet volutpat consequat mauris.
Fringilla est ullamcorper eget nulla facilisi etiam dignissim.
Aliquam malesuada bibendum arcu vitae elementum curabitur vitae.
Bibendum ut tristique et egestas quis ipsum. Dolor sit amet consectetur adipiscing.
Egestas pretium aenean pharetra magna. Suspendisse sed nisi lacus sed viverra.
Risus nec feugiat in fermentum posuere urna nec tincidunt praesent.
Auctor eu augue ut lectus arcu bibendum at. Vel turpis nunc eget lorem dolor.
Duis at consectetur lorem donec massa. Sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus.
Leo urna molestie at elementum eu facilisis sed. Euismod nisi porta lorem mollis aliquam ut porttitor leo a.
Sagittis vitae et leo duis ut. Egestas egestas fringilla phasellus faucibus scelerisque.`;

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

  test('Has Multer storage', () => {
    expect(app.storage).not.toEqual(null);
  });
});

describe('When a user is not logged in', () => {
  // Register before running tests.
  beforeAll((done) => {
    async.series([
      (requestDone) => agent
        .post('/register')
        .field('firstName', testFirstName)
        .field('lastName', testLastName)
        .field('email', testEmail6)
        .field('password', testPasswordCorrect)
        .field('username', testUsername6)
        .attach('image', testImageValid)
        .then(() => { requestDone(); }),
    ], done);
  });

  test('The API is active', (done) => {
    agent
      .get('/testAPI')
      .expect(200)
      .then(() => { done(); });
  });

  test('They are not authorized', (done) => {
    agent
      .get('/checkAuth')
      .expect(401)
      .then(() => { done(); });
  });

  test('They are rejected from accessing the /comment route', (done) => {
    agent
      .post('/comment')
      .expect(401)
      .then(() => { done(); });
  });

  test('They are rejected from accessing the /follow route', (done) => {
    agent
      .post('/follow')
      .expect(401)
      .then(() => { done(); });
  });

  test('They are rejected from accessing the /like route', (done) => {
    agent
      .post('/like')
      .expect(401)
      .then(() => { done(); });
  });

  test('They are rejected from accessing the /getLikes route', (done) => {
    agent
      .get('/getLikes')
      .expect(401)
      .then(() => { done(); });
  });

  test('They are rejected from accessing the /addPost route', (done) => {
    agent
      .post('/addPost')
      .expect(401)
      .then(() => { done(); });
  });

  test('They are rejected from accessing the /editPost route', (done) => {
    agent
      .post('/editPost')
      .expect(401)
      .then(() => { done(); });
  });

  test('They are rejected from accessing the /getFeed route', (done) => {
    agent
      .get('/getFeed')
      .expect(401)
      .then(() => { done(); });
  });

  test('They are rejected from accessing the /getPost/:postId route', (done) => {
    agent
      .get(`/getPost/${testPostIdIncorrect}`)
      .expect(401)
      .then(() => { done(); });
  });

  test('They are rejected from accessing the /deletePost route', (done) => {
    agent
      .post('/deletePost')
      .expect(401)
      .then(() => { done(); });
  });

  test('They are rejected from accessing the /getUser route', (done) => {
    agent
      .get('/getUser')
      .expect(401)
      .then(() => { done(); });
  });

  test('They are rejected from accessing the /getOtherUser/:username route', (done) => {
    agent
      .get(`/getOtherUser/${testUsername1}`)
      .expect(401)
      .then(() => { done(); });
  });

  test('They are rejected from accessing the /getSuggestedUsers route', (done) => {
    agent
      .get('/getSuggestedUsers')
      .expect(401)
      .then(() => { done(); });
  });

  test('They can register an account with an image', (done) => {
    agent
      .post('/register')
      .field('firstName', testFirstName)
      .field('lastName', testLastName)
      .field('email', testEmail7)
      .field('password', testPasswordCorrect)
      .field('username', testUsername7)
      .attach('image', testImageValid)
      .expect(201)
      .then(() => { done(); });
  });

  test('They can register an account without an image', (done) => {
    agent
      .post('/register')
      .field('firstName', testFirstName)
      .field('lastName', testLastName)
      .field('email', testEmail8)
      .field('password', testPasswordCorrect)
      .field('username', testUsername8)
      .expect(201)
      .then(() => { done(); });
  });

  test('They cannot register an account with an overly large image', (done) => {
    agent
      .post('/register')
      .field('firstName', testFirstName)
      .field('lastName', testLastName)
      .field('email', testEmail9)
      .field('password', testPasswordCorrect)
      .field('username', testUsername9)
      .attach('image', testImageInvalid)
      .expect(413)
      .then(() => { done(); });
  });

  test('They cannot register an account with a non-image file', (done) => {
    agent
      .post('/register')
      .field('firstName', testFirstName)
      .field('lastName', testLastName)
      .field('email', testEmail9)
      .field('password', testPasswordCorrect)
      .field('username', testUsername9)
      .attach('image', testFileInvalid)
      .expect(422)
      .then(() => { done(); });
  });

  test('They cannot register an account with a duplicate email address', (done) => {
    agent
      .post('/register')
      .field('firstName', testFirstName)
      .field('lastName', testLastName)
      .field('email', testEmail1)
      .field('password', testPasswordCorrect)
      .field('username', testUsername6)
      .attach('image', testImageValid)
      .expect(409)
      .then(() => { done(); });
  });

  test('They cannot register an account with a duplicate username', (done) => {
    agent
      .post('/register')
      .field('firstName', testFirstName)
      .field('lastName', testLastName)
      .field('email', testEmail6)
      .field('password', testPasswordCorrect)
      .field('username', testUsername1)
      .attach('image', testImageValid)
      .expect(409)
      .then(() => { done(); });
  });

  test('They cannot log in with an invalid password', (done) => {
    agent
      .post('/login')
      .send({
        email: testEmail6,
        password: testPasswordIncorrect,
      })
      .expect(401)
      .then(() => { done(); });
  });
});

describe('When a user is logged in', () => {
  // Register, log in, and prepare dummy data before running tests.
  beforeAll((done) => {
    async.series([
      (requestDone) => agent
        .post('/register')
        .field('firstName', testFirstName)
        .field('lastName', testLastName)
        .field('email', testEmail1)
        .field('password', testPasswordCorrect)
        .field('username', testUsername1)
        .attach('image', testImageValid)
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/register')
        .field('firstName', testFirstName)
        .field('lastName', testLastName)
        .field('email', testEmail2)
        .field('password', testPasswordCorrect)
        .field('username', testUsername2)
        .attach('image', testImageValid)
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/register')
        .field('firstName', testFirstName)
        .field('lastName', testLastName)
        .field('email', testEmail3)
        .field('password', testPasswordCorrect)
        .field('username', testUsername3)
        .attach('image', testImageValid)
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/register')
        .field('firstName', testFirstName)
        .field('lastName', testLastName)
        .field('email', testEmail4)
        .field('password', testPasswordCorrect)
        .field('username', testUsername4)
        .attach('image', testImageValid)
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/register')
        .field('firstName', testFirstName)
        .field('lastName', testLastName)
        .field('email', testEmail5)
        .field('password', testPasswordCorrect)
        .field('username', testUsername5)
        .attach('image', testImageValid)
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
        .attach('image', testImageValid)
        .expect(201)
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/addPost')
        .field('title', testTitle2)
        .field('description', testDescription)
        .field('privacy', testPrivacy)
        .field('tags', testTags)
        .attach('image', testImageValid)
        .expect(201)
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/addPost')
        .field('title', testTitle3)
        .field('description', testDescription)
        .field('privacy', testPrivacy)
        .field('tags', testTags)
        .attach('image', testImageValid)
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
      (requestDone) => agent
        .post('/logout')
        .expect(200)
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/login')
        .send({
          email: testEmail3,
          password: testPasswordCorrect,
        })
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/follow')
        .send({
          username: testUsername2,
          method: 'follow',
        })
        .expect(200)
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/logout')
        .expect(200)
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/login')
        .send({
          email: testEmail1,
          password: testPasswordCorrect,
        })
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
            { username: testUsername4 },
            { username: testUsername5 },
            { username: testUsername6 },
            { username: testUsername7 },
            { username: testUsername8 },
            { username: testUsername9 },
            { username: testUsername10 },
          ],
        },
      )
      .then(() => {
        Post.deleteMany(
          {
            $or: [
              { username: testUsername1 },
              { username: testUsername2 },
              { username: testUsername3 },
              { username: testUsername4 },
              { username: testUsername5 },
              { username: testUsername6 },
              { username: testUsername7 },
              { username: testUsername8 },
              { username: testUsername9 },
              { username: testUsername10 },
            ],
          },
        ).then(done);
      });
  });

  test('The API is active', (done) => {
    agent
      .get('/testAPI')
      .expect(200)
      .then(() => { done(); });
  });

  test('They are authorized', (done) => {
    agent
      .get('/checkAuth')
      .expect(200)
      .then(() => { done(); });
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
      .then(() => { done(); });
  });

  test('They cannot add a comment with overly long text', (done) => {
    agent
      .post('/comment')
      .send({
        postId: testPostId1,
        text: testLongText,
        method: 'add',
      })
      .expect(422)
      .then(() => { done(); });
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
      .then(() => { done(); });
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
      .then(() => { done(); });
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
      .then(() => { done(); });
  });

  test('They can follow another user', (done) => {
    agent
      .post('/follow')
      .send({
        username: testUsername2,
        method: 'follow',
      })
      .expect(200)
      .then(() => { done(); });
  });

  test('They cannot follow a user they already follow', (done) => {
    agent
      .post('/follow')
      .send({
        username: testUsername4,
        method: 'follow',
      })
      .expect(400)
      .then(() => { done(); });
  });

  test('They can unfollow another user', (done) => {
    agent
      .post('/follow')
      .send({
        username: testUsername3,
        method: 'unfollow',
      })
      .expect(200)
      .then(() => { done(); });
  });

  test('They cannot unfollow a user they do not follow', (done) => {
    agent
      .post('/follow')
      .send({
        username: testUsername5,
        method: 'unfollow',
      })
      .expect(400)
      .then(() => { done(); });
  });

  test('They cannot make a malformed follow request', (done) => {
    agent
      .post('/follow')
      .send({
        username: testUsername5,
        method: 'malformed',
      })
      .expect(400)
      .then(() => { done(); });
  });

  test('They can like a post', (done) => {
    agent
      .post('/like')
      .send({
        postId: testPostId1,
        method: 'add',
      })
      .expect(201)
      .then(() => { done(); });
  });

  test('They can unlike a post', (done) => {
    agent
      .post('/like')
      .send({
        postId: testPostId2,
        method: 'remove',
      })
      .expect(200)
      .then(() => { done(); });
  });

  test('They cannot make a malformed like request', (done) => {
    agent
      .post('/like')
      .send({
        postId: testPostId1,
        method: 'malformed',
      })
      .expect(400)
      .then(() => { done(); });
  });

  test('They can get their liked posts', (done) => {
    agent
      .get('/getLikes')
      .expect(200)
      .then(() => { done(); });
  });

  test('They can add a post', (done) => {
    agent
      .post('/addPost')
      .field('title', testTitle4)
      .field('description', testDescription)
      .field('privacy', testPrivacy)
      .field('tags', testTags)
      .attach('image', testImageValid)
      .expect(201)
      .then(() => { done(); });
  });

  test('They cannot add a post with an overly long title', (done) => {
    agent
      .post('/addPost')
      .field('title', testLongText)
      .field('description', testDescription)
      .field('privacy', testPrivacy)
      .field('tags', testTags)
      .attach('image', testImageValid)
      .expect(422)
      .then(() => { done(); });
  });

  test('They cannot add a post with an overly long description', (done) => {
    agent
      .post('/addPost')
      .field('title', testTitle4)
      .field('description', testLongText)
      .field('privacy', testPrivacy)
      .field('tags', testTags)
      .attach('image', testImageValid)
      .expect(422)
      .then(() => { done(); });
  });

  test('They cannot add a post with an overly large image', (done) => {
    agent
      .post('/addPost')
      .field('title', testTitle4)
      .field('description', testDescription)
      .field('privacy', testPrivacy)
      .field('tags', testTags)
      .attach('image', testImageInvalid)
      .expect(413)
      .then(() => { done(); });
  });

  test('They cannot add a post without an image', (done) => {
    agent
      .post('/addPost')
      .field('title', testTitle4)
      .field('description', testDescription)
      .field('privacy', testPrivacy)
      .field('tags', testTags)
      .expect(422)
      .then(() => { done(); });
  });

  test('They cannot add a post with a non-image file', (done) => {
    agent
      .post('/addPost')
      .field('title', testTitle4)
      .field('description', testDescription)
      .field('privacy', testPrivacy)
      .field('tags', testTags)
      .attach('image', testFileInvalid)
      .expect(422)
      .then(() => { done(); });
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
      .then(() => { done(); });
  });

  test('They can get their feed', (done) => {
    agent
      .get('/getFeed')
      .expect(200)
      .then(() => { done(); });
  });

  test('They can get a post', (done) => {
    agent
      .get(`/getPost/${testPostId2}`)
      .expect(200)
      .then(() => { done(); });
  });

  test('They cannot get a nonexistent post', (done) => {
    agent
      .get(`/getPost/${testPostIdIncorrect}`)
      .expect(404)
      .then(() => { done(); });
  });

  test('They can delete a post', (done) => {
    agent
      .post('/deletePost')
      .send({
        postId: testPostId3,
      })
      .expect(200)
      .then(() => { done(); });
  });

  test('They can get their own profile data', (done) => {
    agent
      .get('/getUser')
      .expect(200)
      .then(() => { done(); });
  });

  test('They can get the profile data of another user', (done) => {
    agent
      .get(`/getOtherUser/${testUsername2}`)
      .expect(200)
      .then(() => { done(); });
  });

  test('They cannot get the profile data of a nonexistent user', (done) => {
    agent
      .get(`/getOtherUser/${testUsernameIncorrect}`)
      .expect(404)
      .then(() => { done(); });
  });

  test('They can get a list of suggested users', (done) => {
    agent
      .get('/getSuggestedUsers')
      .expect(200)
      .then(() => { done(); });
  });

  test('They can log out', (done) => {
    agent
      .post('/logout')
      .expect(200)
      .then(() => { done(); });
  });
});

describe('When a user is not logged in', () => {
  // Register before running tests.
  beforeAll((done) => {
    async.series([
      (requestDone) => agent
        .post('/register')
        .field('firstName', testFirstName)
        .field('lastName', testLastName)
        .field('email', testEmail1)
        .field('password', testPasswordCorrect)
        .field('username', testUsername1)
        .attach('image', testImageValid)
        .then(() => { requestDone(); }),
    ], done);
  });

  test('They can log in', (done) => {
    agent
      .post('/login')
      .send({
        email: testEmail1,
        password: testPasswordCorrect,
      })
      .expect(200)
      .then(() => { done(); });
  });

  test('They can log out', (done) => {
    agent
      .post('/logout')
      .expect(200)
      .then(() => { done(); });
  });
});

describe('When a user fails too many login attempts', () => {
  // Register, log in, and prepare dummy data before running tests.
  beforeAll((done) => {
    async.series([
      (requestDone) => agent
        .post('/register')
        .field('firstName', testFirstName)
        .field('lastName', testLastName)
        .field('email', testEmail10)
        .field('password', testPasswordCorrect)
        .field('username', testUsername10)
        .attach('image', testImageValid)
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/login')
        .send({
          email: testEmail10,
          password: testPasswordIncorrect,
        })
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/login')
        .send({
          email: testEmail10,
          password: testPasswordIncorrect,
        })
        .then(() => { requestDone(); }),
      (requestDone) => agent
        .post('/login')
        .send({
          email: testEmail10,
          password: testPasswordIncorrect,
        })
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
            { username: testUsername4 },
            { username: testUsername5 },
            { username: testUsername6 },
            { username: testUsername7 },
            { username: testUsername8 },
            { username: testUsername9 },
            { username: testUsername10 },
          ],
        },
      )
      .then(() => {
        Post.deleteMany(
          {
            $or: [
              { username: testUsername1 },
              { username: testUsername2 },
              { username: testUsername3 },
              { username: testUsername4 },
              { username: testUsername5 },
              { username: testUsername6 },
              { username: testUsername7 },
              { username: testUsername8 },
              { username: testUsername9 },
              { username: testUsername10 },
            ],
          },
        ).then(done);
      });
  });

  test('They are locked out', (done) => {
    agent
      .post('/login')
      .send({
        email: testEmail10,
        password: testPasswordCorrect,
      })
      .expect(401)
      .then(() => { done(); });
  });
});
