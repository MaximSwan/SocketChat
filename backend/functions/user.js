
var passport = require('../functions/passport');

var vkToken = process.env.VKTOKEN;
var vkAuth = require('vk-auth')(123456, 'audio');

let createUser = data => {
  try {
    passport.checkBody(data);
    passport.signUp(data.username, data.password);
  } catch (err) {
    console.error(err);
  }
}

let authentication = async data => {
  try {
    io = data[0];
    passport.checkBody(data);
    let user = await passport.logIn(data[1].username, data[1].password);
    if (user == 'Incorrect') {
      return io.emit('login', 'Incorrect');
    }
    user = JSON.stringify(user);
    let userToken = Buffer.from(user).toString('base64');
    io.emit('login', userToken);
  } catch (err) {
    console.error(err);
  }
}

let authenticationVK = data => {
  try {
    var io = data[0];
    passport.checkBody(data);
    vkAuth.authorize(data[1].username, data[1].password);

    vkAuth.on('error', function (err) {
      return io.emit('loginVk', 'Incorrect');
    });

    vkAuth.on('auth', function (tokenParams) {
      rp(`https://api.vk.com/method/users.get?user_id=${tokenParams.user_id}&v=5.52&access_token=${vkToken}`)
        .then(res => {
          res = Buffer.from(res).toString('base64');
          io.emit('loginVk', res);
        })
    })
  } catch (err) {
    console.error(err);
  }
}

module.exports.createUser = createUser;
module.exports.authentication = authentication;
module.exports.authenticationVk = authenticationVK;