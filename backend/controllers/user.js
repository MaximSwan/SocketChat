
var passport = require('./passport');

var vkToken = process.env.VKTOKEN;
var vkAuth = require('vk-auth')(123456, 'audio');

class User {

  constructor() { }
  async createUser(data) {
    try {
      await passport.checkBody(data);
      return passport.signUp(data.username, data.password);
    } catch (err) {
      console.error(err);
    }
  }

  async authentication(data) {
    try {
      let io = data.io;
      await passport.checkBody(data);
      let user = await passport.logIn(data.user.username, data.user.password);
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

  async authenticationVK(data) {
    try {
      let io = data.io;
      await passport.checkBody(data);
      vkAuth.authorize(data.user.username, data.user.password);

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

}

module.exports = new User();