// Acknowledgments:
// Passport tutorial: https://youtu.be/-RCnNyD0L-s

const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const engine = require('ejs-locals');
const path = require('path');
const initializePassport = require('./passport-config');

// TODO: Should this be a devDependency instead?
require('dotenv').config();

const app = express();

// TODO: Save this information to a database instead.
const users = [];

initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id),
);

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

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect('/login');
  } catch (error) {
    req.redirect('/register');
  }
});

app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

app.listen(8000);

module.exports = app;
