var express = require('express');
var router = express.Router();
var bCrypt = require('bcryptjs');
var db = require('../db/db.js');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var vkAuth = require('vk-auth')(123456, 'audio');

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

class Passport {

  constructor() {
  }
  signUp(username, password, done) {
    db.User.findOne({ username: username }, function (err, user) {

      if (err)
        return done(err);

      if (user) {
        return 'incorrect user';
      } else {

        let newUser = new db.User();
        newUser.username = username;
        newUser.password = createHash(password);
        newUser.role = 'User';
        newUser.save(function (err) {
          if (err)
            throw err;

          return newUser;
        });
      }
    });
  }

  async logInVk(login, password) {
    vkAuth.authorize(login, password);

    vkAuth.on('error', function (err) {
      return 'Incorrect'
    });

    vkAuth.on('auth', function (tokenParams) {
      return tokenParams;
    })
  }

  async logIn(username, password) {
    try {
      let user = await db.User.findOne({ username: username });

      if (!user) {
        return 'Incorrect';
      }

      if (!isValidPassword(user, password)) {

        return 'Incorrect';
      }

      return user;

    } catch (err) {
      console.error(err);
    }

  }

  checkBody(data) {
    if (!data) {
      return { statusCode: 400, message: 'is empty' }
    } else {
      return { statusCode: 200, message: 'all is well' }
    }
  }

  checkErr(err) {
    console.error(err);
    if (err && err.name && err.name === 'ValidationError') {
      let errorData = { statusCode: 400, message: '' };
      let validationKey = Object.keys(err.errors);
      validationKey.forEach(key => {
        errorData.message = errorData.message.concat(err.errors[key].message) + ' '
      });
      return console.error(`statusCode: ${errorData.statusCode}, error: ${errorData}`);
    }

    let errorData = {
      statusCode: err && err.statusCode < 500 && err.statusCode || 500,
      message: err && err.statusCode < 500 && err.message || 'Internal server error'
    };
    return console.error(`statusCode: ${errorData.statusCode}, error: ${errorData}`);
  }

}

module.exports = new Passport();