module.exports = function (server) {
  require('dotenv').config();
  var db = require('../db/db');
  var rp = require('request-promise');
  var roomController = require('./room');
  var messageController = require('./message');
  var passport = require('./passport');
  var io = require('socket.io')(server);
  const userController = require('./user');

  io.on('connection', (socket) => {

    console.log('New user connected');

    socket.on('register', data => { userController.createUser(data) });

    socket.on('login', data => { userController.authentication([io, data])});

    socket.on('loginVk', data => { userController.authenticationVk([io, data]) });

    socket.on('createRoom', data => { roomController.creatRoom([io, data]) });

    socket.on('getRooms', data => { roomController.getRooms([io, data]) });

    socket.on('deleteRoom', data => { roomController.deleteRoom([io, data]) });

    socket.on('connectRoom', room => { roomController.connectRoom([io, socket, room]) });

    socket.on('disconnectRoom', room => { roomController.disconnectRoom([io, socket, room]) });

    socket.on('message', data => { roomController.addMessage([io, socket, data]) });

    socket.on('checkMessage', data => { roomController.checkMessageNow([io, socket, data]) })

    socket.on('disconnect', () => { console.log('user disconnected'); });

  })
}