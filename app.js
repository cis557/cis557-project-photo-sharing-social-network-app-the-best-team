/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
// Acknowledgments:
// Passport tutorial: https://youtu.be/-RCnNyD0L-s
// Image upload tutorial: https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088
// Image upload sample: https://github.com/Bigeard/upload-express
// Passport testing tutorial: https://medium.com/@internetross/a-pattern-for-creating-authenticated-sessions-for-routing-specs-with-supertest-and-jest-until-the-baf14d498e9d

const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const engine = require('ejs-locals');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const fs = require('fs');
require('./passport-config')(passport);
const User = require('./models/User');
const Post = require('./models/Post');
require('dotenv').config();

/**
 * MongoDB initialization.
 */

mongoose.connect(process.env.DB_URL, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to MongoDB Atlas');
  }
});

/**
 * Express initialization.
 */
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('html', engine);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

/**
 * Multer initialization.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const a = file.originalname.split('.');
    cb(null, `${file.fieldname}-${Date.now()}.${a[a.length - 1]}`);
  },
});

const parser = multer({ storage });

/**
 * Functions used to protect routes based on authentication status.
 */
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  return next();
}

/**
 * GET routes for displaying pages.
 */

app.get('/', checkAuthenticated, (req, res) => {
  res.redirect('/feed');
});

app.get('/register', checkNotAuthenticated, (req, res) => {
  if (req.query.error) {
    res.render('register.ejs', { messages: { error: req.query.error } });
  } else {
    res.render('register.ejs');
  }
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

app.get('/feed', checkAuthenticated, (req, res) => {
  res.render('feed.ejs', { name: req.user.name, posts: Post });
});

app.get('/profile', checkAuthenticated, (req, res) => {
  res.render('profile.ejs', { name: req.user.firstName });
});

app.get('/follow', checkAuthenticated, (req, res) => {
  User.find({}, (err, data) => {
    res.render('follow.ejs', {
      user: req.body.username,
      names: data,
    });
  });
});


app.get('/follower', checkAuthenticated, (req, res) => {
  User.find({}, (err, data) => {
    res.render('follower.ejs', {
      user: req.body.username,
      names: data,
    });
  });
});

app.get('/followee', checkAuthenticated, (req, res) => {
  User.find({}, (err, data) => {
    res.render('followee.ejs', {
      user: req.body.username,
      names: data,
    });
  });
});

/**
 * POST routes for registration/login.
 */

app.post('/follower', checkAuthenticated, async (req, res) => {
  console.log(req.body.username);
  try {
    const user = req.body.username;
    const userFollowers = req.body.followArray;
    const { followeeArray } = req.body;
    if (!(userFollowers.indexOf(req.body.followname) > -1)) {
      userFollowers.push(req.body.followname);
      console.log(userFollowers);
      followeeArray.push(user);
      console.log(followeeArray);
      await User.findOneAndUpdate({ username: user }, { $set: { followers: userFollowers } });
      await User.findOneAndUpdate({ username: req.body.followname }, { $set: { followees: followeeArray } });
    }
  } catch (error) {
    res.redirect('/feed');
  }
});

app.post('/followee', checkAuthenticated, async (req, res) => {
  console.log(req.body.username);
  try {
    const user = req.body.username;
    const userFollowers = req.body.followArray;
    const { followeeArray } = req.body;
    if (userFollowers.indexOf(req.body.followname) > -1) {
      userFollowers.splice(userFollowers.indexOf(req.body.followname), 1);
      followeeArray.splice(followeeArray.indexOf(user), 1);
      await User.findOneAndUpdate({ username: user }, { $set: { followers: userFollowers } });
      await User.findOneAndUpdate({ username: req.body.followname }, { $set: { followees: followeeArray } });
    }
  } catch (error) {
    res.redirect('/feed');
  }
});

app.post('/register', checkNotAuthenticated, parser.single('image'), async (req, res) => {
  try {
    const defaultImg = fs.readFileSync(path.join(__dirname, 'public/images/default-profile.png'));
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const incomingUser = {
      _id: Date.now().toString(),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
      username: req.body.username,
      posts: [],
      followers: [],
      followees: [],
      image: Buffer.from(defaultImg, 'base64'),
      likes: [],
    };

    User.findOne({ email: incomingUser.email })
      .then((user) => {
        if (user) {
          const message = encodeURIComponent('This email address is already in use');
          res.redirect(`/register?error=${message}`);
        } else {
          User.findOne({ username: incomingUser.username })
            .then((userTwo) => {
              if (userTwo) {
                const message = encodeURIComponent('This username is already in use');
                res.redirect(`/register?error=${message}`);
              } else {
                if (req.file) {
                  let bytes;
                  try {
                    const img = fs.readFileSync(req.file.path);
                    bytes = img.toString('base64');
                    fs.unlinkSync(req.file.path);
                  } catch (error) {
                    res.redirect(`/register?error=${error}`);
                  }
                  incomingUser.image = Buffer.from(bytes, 'base64');
                }

                const newUser = new User({
                  _id: incomingUser.id,
                  firstName: incomingUser.firstname,
                  lastName: incomingUser.lastname,
                  email: incomingUser.email,
                  password: incomingUser.password,
                  posts: incomingUser.posts,
                  followers: incomingUser.followers,
                  followees: incomingUser.followees,
                  image: incomingUser.image,
                  username: incomingUser.username,
                  likes: incomingUser.likes,
                });

                newUser.save()
                  .then(() => {})
                  .catch((err) => console.log(err));

                res.redirect('/login');
              }
            });
        }
      });
  } catch (error) {
    res.redirect('/register');
  }
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

app.get('/user', checkAuthenticated, (req, res) => {
  User.findOne({ email: req.user.email })
    .then((user) => res.send(user))
    .catch((err) => console.log(err));
});

app.delete('/user', checkAuthenticated, (req, res) => {
  Post.deleteMany({ email: req.user.email })
    .catch((err) => console.log(err));
  User.deleteOne({ email: req.user.email })
    .catch((err) => console.log(err));

  // TODO: The response should vary based on whether the deletion was successful.
  res.sendStatus(200);
});

app.get('/users', checkAuthenticated, (req, res) => {
  User.find({}, (err, users) => {
    const userArray = [];
    users.forEach((user) => {
      userArray.push(user);
    });
    res.send(userArray);
  });
});

app.delete('/logout', checkAuthenticated, (req, res) => {
  req.logOut();
  res.redirect('/login');
});

/**
 * Routes for creating and deleting posts.
 */

app.post('/post', checkAuthenticated, parser.single('image'), (req, res) => {
  // The steps are:
  //    1. Upload image to the server-side file system.
  //    2. Cache the image's bytes.
  //    3. Delete the image from the server-side file system.
  // Ideally, the app would skip #1 and #3, instead getting the bytes directly from the request.
  // However, #1 and #3 appear to be necessary, at least based on readily available documentation.

  let bytes;

  try {
    const img = fs.readFileSync(req.file.path);
    bytes = img.toString('base64');
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.log(error);
    res.redirect('/feed');
  }

  const incomingPost = {
    email: req.user.email,
    contentType: req.file.mimetype,
    image: Buffer.from(bytes, 'base64'),
    datetime: Date.now(),
    likes: [],
    comments: [],
  };

  const newPost = new Post({
    email: incomingPost.email,
    contentType: incomingPost.contentType,
    image: incomingPost.image,
    datetime: incomingPost.datetime,
    likes: incomingPost.likes,
    comments: incomingPost.comments,
  });

  newPost.save()
    .then((post) => {
      User.findOneAndUpdate({ email: incomingPost.email }, { $push: { posts: post._id } })
        .then(() => {
          res.redirect('/feed');
        })
        .catch((err) => {
          throw err;
        });
    })
    .catch((err) => console.log(err));
});

app.get('/post/:_id', checkAuthenticated, (req, res) => {
  const { _id } = req.params;
  Post.findOne({ _id: ObjectId(_id) }, (err, result) => {
    if (err) {
      // TODO: Report error to user.
    } else if (result == null || result.image == null) {
      // TODO: Report error to user.
    } else {
      res.send(Buffer.from(result.image, 'binary'));
    }
  });
});

app.get('/profile/:email', checkAuthenticated, (req, res) => {
  const { email } = req.params;
  User.findOne({ email }, (err, result) => {
    if (err) {
      // TODO: Report error to user.
    } else {
      res.send(Buffer.from(result.image, 'binary'));
    }
  });
});

// TODO: The routes below are for future milestones.

/*
app.post('/post/:id', checkAuthenticated, (req, res) => {
  // TODO: Implement this route.
});

app.delete('/post/:id', checkAuthenticated, (req, res) => {
  // TODO: Implement this route.
});
*/

/**
 * Routes for liking posts.
 */

app.get('/like/:_id', checkAuthenticated, (req, res) => {
  const { _id } = req.params;
  Post.findOne({ _id: ObjectId(_id) }, (err, result) => {
    if (err) {
      // TODO: Report error to user.
    } else if (result == null || result.likes == null) {
      // TODO: Report error to user.
    } else {
      res.send(result.likes);
    }
  });
});

app.post('/like/:_id', checkAuthenticated, (req, res) => {
  const { _id } = req.params;
  const user = req.user.email;
  Post.findOneAndUpdate({ _id: ObjectId(_id) }, { $push: { likes: user } })
    .then(() => {
      User.findOneAndUpdate({ email: user }, { $push: { likes: _id } })
        .then(() => {
          res.send({ code: 200 });
        })
        .catch(() => {
          res.send({ code: 400 });
        });
    })
    .catch(() => {
      // TODO
    });
});

app.delete('/like/:_id', checkAuthenticated, (req, res) => {
  const { _id } = req.params;
  const user = req.user.email;
  Post.findOneAndUpdate({ _id: ObjectId(_id) }, { $pull: { likes: user } })
    .then(() => {
      User.findOneAndUpdate({ email: user }, { $pull: { likes: _id } })
        .then(() => {
          res.send({ code: 200 });
        })
        .catch(() => {
          res.send({ code: 400 });
        });
    })
    .catch(() => {
      // TODO
    });
});


/**
 * Routes for commenting on posts.
 */

/*
app.post('/comment', checkAuthenticated, (req, res) => {
  // TODO: Implement this route.
});

app.post('/comment/:id', checkAuthenticated, (req, res) => {
  // TODO: Implement this route.
});

app.delete('/comment:id', checkAuthenticated, (req, res) => {
  // TODO: Implement this route.
});
*/

/**
 * Routes for followers and followees.
 */


// app.post('/follow', checkAuthenticated, (req, res) => {
//   // TODO: Implement this route.
// });

// app.delete('/follow', checkAuthenticated, (req, res) => {
//   // TODO: Implement this route.
// });

// app.get('/followers', checkAuthenticated, (req, res) => {
//   // TODO: Implement this route.
// });

// app.get('/followees', checkAuthenticated, (req, res) => {
//   // TODO: Implement this route.
// });

module.exports = {
  app,
  checkAuthenticated,
  checkNotAuthenticated,
  mongoose,
};
