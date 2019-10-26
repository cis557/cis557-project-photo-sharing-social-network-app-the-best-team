/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/User');

module.exports = function (passport) {
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
};
