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
    console.log(`[!] Cound not connect to MongoDB Atlas: ${err}`);
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

// The routes depend on these exports, so export them first.
module.exports = {
  checkAuthenticated,
  checkNotAuthenticated,
  expressApp,
  passport,
  parser,
};

expressApp.use(require('./routes/authRouter'));
expressApp.use(require('./routes/followRouter'));
expressApp.use(require('./routes/postRouter'));
expressApp.use(require('./routes/testRouter'));
expressApp.use(require('./routes/userRouter'));
