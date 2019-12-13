/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const express = require('express');
const { check, sanitize, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const multer = require('multer');
const User = require('./models/User');
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
    // eslint-disable-next-line no-console
    console.log(`[!] Could not connect to MongoDB Atlas: ${err}`);
  } else {
    // eslint-disable-next-line no-console
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
const strategy = new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  // Lockout settings.
  const attemptsToLockout = 3;
  // 5 minutes in milliseconds.
  const msToLockout = 5 * 60 * 1000;
  // 24 hours in milliseconds.
  const msOfLockout = 24 * 60 * 60 * 1000;

  let lockedOut = false;
  let success = false;
  let message = '';

  User.findOne({ email })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        success = false;
        message = 'No user with that email';
        return done(null, false, { message });
      }

      let { attempts } = user.lockout;
      // If lastFailedDatetime < 0, there is no recorded login failure.
      let { lastFailedDatetime } = user.lockout;

      // Check if the user failed too many login attempts.
      if (attempts >= attemptsToLockout) {
        // Check if the user's login failures happened recently.
        if (lastFailedDatetime < 0 || lastFailedDatetime + msOfLockout > Date.now()) {
          // The user's login failures happened recently.
          // They are locked out.
          lockedOut = true;
          success = false;
          message = 'Account is locked out';
          return done(null, false, { message });
        }

        // The user was locked out previously, but enough time elapsed to unlock the account.
        lockedOut = false;
        attempts = 0;
        lastFailedDatetime = -1;
      }

      if (!lockedOut) {
        // The user is not locked out.
        // Check their password.
        bcrypt.compare(password, user.password, (bcryptErr, same) => {
          if (same) {
            // The user provided the correct password.
            attempts = 0;
            lastFailedDatetime = -1;
            success = true;
          } else {
            // The user provided an incorrect password.
            // Check to see if their last login failure happened recently.
            if (lastFailedDatetime > 0 && lastFailedDatetime + msToLockout > Date.now()) {
              // The user's last login failure happened recently.
              attempts += 1;
              lastFailedDatetime = Date.now();
            } else {
              // The user's last login failure did not happen recently.
              attempts = 1;
              lastFailedDatetime = Date.now();
            }

            success = false;
          }

          // Update the user's lockout status.
          User.findOneAndUpdate(
            { email },
            { $set: { 'lockout.attempts': attempts, 'lockout.lastFailedDatetime': lastFailedDatetime } },
            { new: true },
          )
            .then(() => {
              if (success) {
                return done(null, user);
              }

              return done(null, false, { message });
            })
            .catch((err) => done(err));
        });
      }
    })
    .catch((err) => done(err));
});

passport.use(strategy);

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

  return res.status(401).json('[!] Not authorized');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.status(200);
  }

  return next();
}

/**
 * Settings for input validation and sanitization.
 */
function checkAndSanitizeInput() {
  return [
    check('firstName')
      .optional()
      .isLength({ min: 1, max: 32 })
      .trim()
      .escape(),
    check('lastName')
      .optional()
      .isLength({ min: 1, max: 32 })
      .trim()
      .escape(),
    check('email')
      .optional()
      .isEmail()
      .isLength({ min: 1, max: 32 }),
    check('password')
      .optional()
      .isLength({ min: 1, max: 256 })
      .trim()
      .escape(),
    check('username')
      .optional()
      .isLength({ min: 1, max: 32 })
      .trim()
      .escape(),
    check('title')
      .optional()
      .isLength({ max: 32 })
      .trim()
      .escape(),
    check('description')
      .optional()
      .isLength({ max: 256 })
      .trim()
      .escape(),
    check('text')
      .optional()
      .isLength({ max: 256 })
      .trim()
      .escape(),
    sanitize('firstName'),
    sanitize('lastName'),
    sanitize('email'),
    sanitize('password'),
    sanitize('username'),
    sanitize('title'),
    sanitize('description'),
    sanitize('text'),
  ];
}

function handleInputCheck(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const err = errors.array()[0];
  return res.status(422).json(`[!] ${err.param}: ${err.msg}`);
}

const maxFileKb = 100;

function checkFileSize(file) {
  const fileStats = fs.statSync(file.path);
  const fileSizeInBytes = fileStats.size;
  const fileSizeInKilobytes = fileSizeInBytes / 1000.0;

  if (fileSizeInKilobytes > maxFileKb) {
    return false;
  }

  return true;
}

function sendDatabaseErrorResponse(res, err) {
  res.status(550).json(`[!] Database error: ${err}`);
}

/**
 * Express initialization.
 */
const expressApp = express();

expressApp.enable('trust proxy');
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use(logger('dev'));
expressApp.use(flash());
expressApp.use(session({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  /*
  cookie: {
    sameSite: 'none',
    secure: true,
  },
  */
  resave: false,
  saveUninitialized: false,
}));
expressApp.use(express.json());
expressApp.use(express.static(path.join(__dirname, 'public')));
expressApp.use(passport.initialize());
expressApp.use(passport.session());
expressApp.use(methodOverride('_method'));
expressApp.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', 'https://photogram-front.herokuapp.com');
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// The routes depend on these exports, so export them first.
module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  checkAndSanitizeInput,
  handleInputCheck,
  maxFileKb,
  checkFileSize,
  expressApp,
  mongoose,
  passport,
  parser,
  sendDatabaseErrorResponse,
  storage,
};

expressApp.use(require('./routes/authRouter'));
expressApp.use(require('./routes/commentRouter'));
expressApp.use(require('./routes/followRouter'));
expressApp.use(require('./routes/likeRouter'));
expressApp.use(require('./routes/postRouter'));
expressApp.use(require('./routes/testRouter'));
expressApp.use(require('./routes/userRouter'));
