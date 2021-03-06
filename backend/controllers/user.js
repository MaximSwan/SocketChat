
var passport = require('./passport');

var vkToken = process.env.VKTOKEN;
var vkAuth = require('vk-auth')(123456, 'audio');

class User {

  constructor() { }
  async createUser(data) {
    try {
      let dataCheck = await passport.checkBody(data);
      if (dataCheck.message == 'is empty') {
        return;
      }
      return passport.signUp(data.username, data.password);
    } catch (err) {
      console.error(err);
    }
  }

  async authentication(data) {
    try {
      let io = data.io;
      let dataCheck = await passport.checkBody(data);
      if (dataCheck.message == 'is empty') {
        return;
      }
      let user = await passport.logIn(data.user.username, data.user.password);
      if (user == 'Incorrect') {
        return io.emit('login', 'Incorrect');
      }
      user = JSON.stringify(user);
      let userToken = Buffer.from(user).toString('base64');
      io.emit('login', userToken);
    } catch (err) {
      passport.checkErr(err);
    }
  }

  async authenticationVK(data) {
    try {
      let io = data.io;
      let dataCheck = await passport.checkBody(data);
      if (dataCheck.message == 'is empty') {
        return;
      }
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
      passport.checkErr(err);
    }
  }

}

module.exports = new User();