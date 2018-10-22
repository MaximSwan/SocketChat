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

    socket.on('login', data => { userController.authentication({ io: io, user: data }) });

    socket.on('loginVk', data => { userController.authenticationVK({ io: io, user: data }) });

    socket.on('createRoom', data => { roomController.creatRoom({ io: io, room: data }) });

    socket.on('getRooms', data => { roomController.getRooms({ io: io, data: data }) });

    socket.on('deleteRoom', data => { roomController.deleteRoom({ io: io, room: data }) });

    socket.on('connectRoom', room => { roomController.connectRoom({ io: io, socket: socket, room: room }) });

    socket.on('disconnectRoom', room => { roomController.disconnectRoom({ io: io, socket: socket, room: room }) });

    socket.on('message', data => { roomController.addMessage({ io: io, socket: socket, room: data }) });

    socket.on('disconnect', () => { console.log('user disconnected'); });

  })
}