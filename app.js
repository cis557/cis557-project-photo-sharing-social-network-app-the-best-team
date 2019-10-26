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
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const initializePassport = require('./passport-config');
require('dotenv').config();

/**
 * MongoDB initialization.
 */

let db;
let users;
// TODO: This should not be public.
const dbURL = 'mongodb+srv://cis557:cd99ROWai391GPkb@thedatabox-7aslk.mongodb.net/test?retryWrites=true&w=majority';
MongoClient.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err1, client) => {
  if (err1) {
    // TODO: Report error to user.
  } else {
    db = client.db('uploads');

    // TODO: Instead of doing this, query the database when the user hits "submit."
    // (The current implementation is a workaround to deal with async/await problems with Passport.)
    db.collection('users').find().toArray((err2, result) => {
      if (err2) {
        // TODO: Report error to user.
      }

      users = result;
      console.log('Successfully loaded users');
    });
  }
});

initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id),
  // TODO: Make these work correctly.
  /*
  async (email) => {
    await db.collection('users').findOne({ email }, (error, result) => {
      if (error) {
        // TODO: Report error to user.
        return null;
      }

      return result;
    });
  },
  async (id) => {
    await db.collection('users').findOne({ id }, (error, result) => {
      if (error) {
        // TODO: Report error to user.
        return null;
      }

      return result;
    });
  },
  */
);

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
  res.render('feed.ejs', { user: req.user.name });
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
    const user = {
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      posts: [],
    };

    // TODO: Remove this workaround.
    users.push(user);

    db.collection('users').insertOne(user, (error) => {
      if (error) {
        // TODO: Report error to user.
      } else {
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
  const user = users.find((u) => u.email === req.user.email);
  res.json(user);
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

  const post = {
    email: req.user.email,
    contentType: req.file.mimetype,
    // eslint-disable-next-line new-cap
    image: new Buffer.from(bytes, 'base64'),
    datetime: Date.now(),
    likes: [],
    comments: [],
  };

  db.collection('posts').insertOne(post, (error) => {
    if (error) {
      // TODO: Report error to user.
    } else {
      db.collection('users').updateOne(
        { email: req.user.email },
        // eslint-disable-next-line no-underscore-dangle
        { $push: { posts: post._id } },
      );

      res.redirect('/feed');
    }
  });
});

app.get('/post/:id', checkAuthenticated, (req, res) => {
  const { id } = req.params;
  db.collection('posts').findOne({ _id: ObjectId(id) }, (error, result) => {
    if (error) {
      // TODO: Report error to user.
    } else if (result == null || result.image == null) {
      // TODO: Report error to user.
    } else {
      res.contentType('image/jpeg');
      res.send(result.image.buffer);
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
