var db = require('../db/db');
var passport = require('./passport');
var messageFunc = require('./message');

class Room {
  constructor() {
  }
  async creatRoom(data) {
    try {
      await passport.checkBody(data);
      var io = data[0];
      let room = new db.Room();
      room.name = data[1];
      room.validate();
      await room.save();
      io.emit('createRoom', room);
    } catch (err) {
      console.log(err);
    }
  }

  async getRooms(data) {
    try {
      await passport.checkBody(data);
      var io = data[0];
      let rooms = await db.Room.find({});
      io.emit('getRooms', rooms);
    } catch (err) {
      console.error(err);
    }
  }

  async deleteRoom(data) {
    try {
      await passport.checkBody(data);
      var io = data[0];
      let roomDeleted = await db.Room.findOneAndRemove({ name: data[1] });
      io.emit('deleteRoom', roomDeleted);
    } catch (err) {
      console.error(err);
    }
  }

  async connectRoom(data) {
    try {
      await passport.checkBody(data);
      var io = data[0];
      var socket = data[1];
      var room = data[2];
      socket.join(room);
      io.to(room).emit('message', 'I connected to the room');
      socket.on('message', async data => {
      })
    } catch (err) {
      console.error(err);
    }
  }

  async addMessage(data) {
    try {
      await passport.checkBody(data);
      let state = data[2];
      let io = data[0];
      let socket = data[1];
      let room = state[2];
      let token = await messageFunc.sendMessage(state);
      if (token.response) {
        return io.to(room).emit('message', state[0]);
      }
      let user = await db.User.findOne({ username: token.username });
      if (user.role == 'User') {
        return io.to(room).emit('message', state[0]);
      }
      passport.logInVk();
    } catch (err) {
      console.error(err);
    }
  }

  async disconnectRoom(data) {
    try {
      await passport.checkBody(data);
      let socket = data[1];
      let io = data[0];
      let room = data[2];
      socket.leave(room);
      io.to(room).emit('message', 'I leave');
    } catch (err) {
      console.error(err);
    }
  }

  async checkMessageNow(data) {
    try {
      await passport.checkBody(data);
      let io = data[0];
      let socket = data[1];
      let room = data[2];
      io.to(room).emit('checkMessage', 'not Empty');
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = new Room();
