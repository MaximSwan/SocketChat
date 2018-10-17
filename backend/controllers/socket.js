module.exports = function (server) {
  require('dotenv').config();
  var db = require('../db/db');
  var rp = require('request-promise');
  var userFunc = require('../functions/user');
  var roomFunc = require('../functions/room');
  var messageFunc = require('../functions/message');
  var passport = require('../functions/passport');
  var io = require('socket.io')(server);

  io.on('connection', (socket) => {

    console.log('New user connected');

    socket.on('register', data => { userFunc.createUser(data) });

    socket.on('login', data => { userFunc.authentication([io, data]) });

    socket.on('loginVk', data => { userFunc.authenticationVk([io, data]) });

    socket.on('createRoom', data => { roomFunc.creatRoom([io, data]) });

    socket.on('getRooms', data => { roomFunc.getRooms([io, data]) });

    socket.on('deleteRoom', data => { roomFunc.deleteRoom([io, data]) });

    socket.on('connectRoom', room => { roomFunc.connectRoom([io, socket, room]) });

    socket.on('disconnectRoom', room => { roomFunc.disconnectRoom([io, socket, room]) });

    socket.on('message', data => { roomFunc.addMessage([io, socket, data]) });

    socket.on('disconnect', () => { console.log('user disconnected'); });

  })
}