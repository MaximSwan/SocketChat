module.exports = function (server) {
  require('dotenv').config();
  var db = require('../db/db');
  var rp = require('request-promise');
  var userFunc = require('../functions/user')
  var roomFunc = require('../functions/room');
  var messageFunc = require('../functions/message');
  var passport = require('../functions/passport');
  var io = require('socket.io')(server);

  io.on('connection', (socket) => {

    console.log('New user connected');

    socket.on('register', data => { userFunc.createUser(data) });

    socket.on('login', data => { userFunc.authentication([io, data]) });

    socket.on('loginVk', data => { userFunc.authenticationVk([io, data]) });

    socket.on('room', data => { roomFunc.creatRoom([io, data]) });

    socket.on('rooms', data => { roomFunc.getRooms([io, data]) });

    socket.on('roomDelete', data => { roomFunc.deleteRoom([io, data]) })

    socket.on('connectRoom', room => {
      try {
        socket.join(room);
        io.to(room).emit('message', 'I connected to the room');
        socket.on('message', async data => {
          passport.checkBody(data);
          token = await messageFunc.sendMessage(data);
          if (token.response) {
            return io.to(room).emit('message', data[0]);
          }
          let user = await db.User.findOne({ username: token.username });
          if (user.role == 'User') {
            return io.to(room).emit('message', data[0]);
          }
          passport.logInVk();
        })
        socket.on('disconnectRoom', room => {
          socket.leave(room);
          io.to(room).emit('message', 'I leave');
        })
      } catch (err) {
        console.log(err);
      }
    })
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

  })
}