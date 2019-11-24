/* eslint-disable no-underscore-dangle */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const multer = require('multer');
const { ObjectId } = require('mongoose').Types;
const User = require('./models/User');
const Post = require('./models/Post');
require('dotenv').config();

/**
 * MongoDB initialization.
 */
mongoose.connect(process.env.DB_URL, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to MongoDB Atlas');
  }
});

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
 * Passport initialization.
 */
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (userEmail, password, done) => {
    User.findOne({ email: userEmail })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'No user with that email' });
        }

        bcrypt.compare(password, user.password, (err, same) => {
          if (err) {
            throw err;
          }

          if (same) {
            return done(null, user);
          }

          return done(null, false, { message: 'Incorrect password' });
        });

        return done(null, false, { message: 'Incorrect password' });
      })
      .catch((err) => done(err));
  }),
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Functions used to protect routes based on authentication status.
 */
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.sendStatus(500);
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.sendStatus(200);
  }

  return next();
}

/**
 * Express initialization.
 */
const expressApp = express();
expressApp.set('views', path.join(__dirname, 'views'));

expressApp.use(cors());
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use(logger('dev'));
expressApp.use(flash());
expressApp.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
expressApp.use(express.json());
expressApp.use(cookieParser());
expressApp.use(express.static(path.join(__dirname, 'public')));
expressApp.use(passport.initialize());
expressApp.use(passport.session());
expressApp.use(methodOverride('_method'));

const pageRouter = express.Router();
expressApp.use(pageRouter);

pageRouter.get('/testAPI', (req, res) => {
  res.send('API is working properly');
});

const authRouter = express.Router();
expressApp.use(authRouter);

authRouter.post('/register', checkNotAuthenticated, parser.single('image'), async (req, res) => {
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
          // Email address is already in use
          res.sendStatus(400);
        } else {
          User.findOne({ username: incomingUser.username })
            .then((userTwo) => {
              if (userTwo) {
                // Username is already in use
                res.sendStatus(400);
              } else {
                if (req.file) {
                  let bytes;
                  try {
                    const img = fs.readFileSync(req.file.path);
                    bytes = img.toString('base64');
                    fs.unlinkSync(req.file.path);
                  } catch (error) {
                    // Error while reading profile picture
                    res.sendStatus(500);
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

                res.sendStatus(200);
              }
            });
        }
      });
  } catch (error) {
    // Error while registering
    res.sendStatus(500);
  }
});

authRouter.post('/login', checkNotAuthenticated, passport.authenticate('local',
  (req, res) => {
    res.sendStatus(200);
  },
  (req, res) => {
    res.sendStatus(400);
  }));

// Catch 404 and forward to error handler.
expressApp.use((req, res, next) => {
  next(createError(404));
});

// Error handler.
expressApp.use((err, req, res) => {
  // Set locals, only providing error in development.
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page.
  res.sendStatus(err.status || 500);
});

module.exports = {
  expressApp,
};
