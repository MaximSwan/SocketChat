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

let signUp = function (username, password, done) {
  db.User.findOne({ username: username }, function (err, user) {

    if (err)
      return done(err);

    if (user) {
      return 'incorrect user';
    } else {

      let newUser = new db.User();

      newUser.username = username;
      newUser.password = createHash(password);
      newUser.save(function (err) {
        if (err)
          throw err;

        return newUser;
      });
    }
  });
}

let logIn = async (username, password) => {
  try {
    let user = await db.User.findOne({ username: username });
    if (!user) {
      return 'Incorrect username';
    }

    if (!isValidPassword(user, password)) {
      return 'Incorrect password';
    }

    return user;

  } catch (err) {
    console.error(err);
  }

}

module.exports = passport;
module.exports.signUp = signUp;
module.exports.logIn = logIn;