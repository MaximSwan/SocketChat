var express = require('express');
var router = express.Router();
var bCrypt = require('bcryptjs');
var db = require('../db/db.js');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var isValidPassword = function (user, password) {
  return bCrypt.compareSync(password, user.password);
}
var createHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  db.User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy(
  function (username, password, done) {
    db.User.findOne({ username: username }, function (err, user) {
 
      if (err) { return done(err); }

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (!isValidPassword(user, password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);

    });
  }
));

let signUp = function( username, password, done) {
  db.User.findOne({ username: username }, function (err, user) {

    if (err)
      return done(err);

    if (user) {
      return console.log('incorrect user');
    } else {

      let newUser = new db.User();

      newUser.username = username;
      newUser.password = createHash(password);
      newUser.save(function (err) {
        if (err)
          throw err;
        return console.log(newUser);
      });
    }
  });
}

let logIn = new LocalStrategy(
  function (username, password, done) {
    console.log('ewfaw');
    db.User.findOne({ username: username }, function (err, user) {
 
      if (err) { return done(err); }

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      if (!isValidPassword(user, password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);

    });
  }
)

module.exports = passport;
module.exports.signUp = signUp;
module.exports.logIn = logIn;