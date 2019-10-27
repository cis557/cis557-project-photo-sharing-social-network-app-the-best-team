/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
// Acknowledgments:
// Passport tutorial: https://youtu.be/-RCnNyD0L-s
// Image upload tutorial: https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088
// Image upload sample: https://github.com/Bigeard/upload-express

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

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('MONGO CONNECTED');
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

const upload = multer({ storage });

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
  res.render('register.ejs');
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

app.get('/feed', checkAuthenticated, (req, res) => {
  res.render('feed.ejs', { user: req.user.name, posts: Post });
});

app.get('/profile', checkAuthenticated, (req, res) => {
  res.render('profile.ejs', { name: req.user.name });
});

/**
 * POST routes for registration/login.
 */

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const incomingUser = {
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      posts: [],
    };

    User.findOne({ email: incomingUser.email })
      .then((user) => {
        if (user) {
          res.redirect('/register');
        } else {
          const newUser = new User({
            id: incomingUser.id,
            name: incomingUser.name,
            email: incomingUser.email,
            password: incomingUser.password,
            posts: incomingUser.posts,
          });

          newUser.save()
            .then(() => {
              res.redirect('/login');
            })
            .catch((err) => console.log(err));

          res.redirect('/login');
        }
      });
  } catch (error) {
    req.redirect('/register');
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

app.delete('/logout', checkAuthenticated, (req, res) => {
  req.logOut();
  res.redirect('/login');
});

/**
 * Routes for creating and deleting posts.
 */

app.post('/post', checkAuthenticated, upload.single('image'), (req, res) => {
  const img = fs.readFileSync(req.file.path);
  const bytes = img.toString('base64');

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
      console.log(post);
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

app.get('/post/:id', checkAuthenticated, (req, res) => {
  const { id } = req.params;
  Post.findOne({ _id: ObjectId(id) }, (err, result) => {
    if (err) {
      // TODO: Report error to user.
    } else if (result == null || result.image == null) {
      // TODO: Report error to user.
    } else {
      res.send(Buffer.from(result.image, 'binary'));
    }
  });
});

app.delete('/post', checkAuthenticated, (req, res) => {
  // TODO: Implement this route.
});

/**
 * Routes for liking posts.
 */

app.post('/like', checkAuthenticated, (req, res) => {
  // TODO: Implement this route.
});

app.delete('/like', checkAuthenticated, (req, res) => {
  // TODO: Implement this route.
});

/**
 * Routes for commenting on posts.
 */

app.post('/comment', checkAuthenticated, (req, res) => {
  // TODO: Implement this route.
});

app.delete('/comment', checkAuthenticated, (req, res) => {
  // TODO: Implement this route.
});

/**
 * Routes for followers and followees.
 */

app.post('/follow', checkAuthenticated, (req, res) => {
  // TODO: Implement this route.
});

app.delete('/follow', checkAuthenticated, (req, res) => {
  // TODO: Implement this route.
});

app.get('/followers', checkAuthenticated, (req, res) => {
  // TODO: Implement this route.
});

app.get('/followees', checkAuthenticated, (req, res) => {
  // TODO: Implement this route.
});

module.exports = {
  app,
  checkAuthenticated,
  checkNotAuthenticated,
};
