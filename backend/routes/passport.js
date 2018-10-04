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

passport.serializeUser(function (user , cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  db.User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

let signUp = (username, password, done) => {
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

let logInVk = async(login, password) => { 
let us = vkAuth.authorize(login, password);

  vkAuth.on('error', function(err) {
    return 'Incorrect'
});
 
vkAuth.on('auth', function(tokenParams) {
  return tokenParams;
  })
}

let logIn = async (username, password) => {
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

let checkBody = data => {
  if (!data) {
    return { statusCode: 400, message: 'is empty' }
  }
}

module.exports = passport;
module.exports.logInVk = logInVk;
module.exports.signUp = signUp;
module.exports.logIn = logIn;
module.exports.checkBody = checkBody;