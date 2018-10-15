var db = require('../db/db');
var passport = require('../functions/passport');
var messageFunc = require('../functions/message');

let creatRoom = async data => {
  try {
    passport.checkBody(data);
    var io = data[0];
    let room = new db.Room();
    room.name = data[1];
    room.validate();
    await room.save();
    io.emit('room', room);
  } catch (err) {
    console.log(err);
  }
}

let getRooms = async data => {
  try {
    var io = data[0];
    let rooms = await db.Room.find({});
    io.emit('rooms', rooms);
  } catch (err) {
    console.error(err);
  }
}

let deleteRoom = async data => {
  try {
    passport.checkBody(data);
    var io = data[0];
    let roomDeleted = await db.Room.findOneAndRemove({ name: data[1] });
    io.emit('roomDelete', roomDeleted);
  } catch (err) {
    console.error(err);
  }
}

let connectRoom = async data => {
  passport.checkBody(data);
  var io = data[0];
  var socket = data[1];
  var room = data[2];
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
}

module.exports.creatRoom = creatRoom;
module.exports.getRooms = getRooms;
module.exports.deleteRoom = deleteRoom;
module.exports.connectRoom = connectRoom;
