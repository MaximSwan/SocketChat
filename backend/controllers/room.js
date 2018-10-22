var db = require('../db/db');
var passport = require('./passport');
var messageFunc = require('./message');

class Room {
  constructor() {
  }
  async creatRoom(data) {
    try {
      let dataCheck = await passport.checkBody(data);
      if (dataCheck.message == 'is empty') {
        return;
      }
      var io = data.io;
      let room = new db.Room();
      room.name = data.room;
      room.validate();
      await room.save();
      io.emit('createRoom', room);
    } catch (err) {
      console.log(err);
    }
  }

  async getRooms(data) {
    try {
      let dataCheck = await passport.checkBody(data);
      if (dataCheck.message == 'is empty') {
        return;
      }
      var io = data.io;
      let rooms = await db.Room.find({});
      io.emit('getRooms', rooms);
    } catch (err) {
      console.error(err);
    }
  }

  async deleteRoom(data) {
    try {
      let dataCheck = await passport.checkBody(data);
      if (dataCheck.message == 'is empty') {
        return;
      }
      var io = data.io;
      let roomDeleted = await db.Room.findOneAndRemove({ name: data.room });
      io.emit('deleteRoom', roomDeleted);
    } catch (err) {
      console.error(err);
    }
  }

  async connectRoom(data) {
    try {
      let dataCheck = await passport.checkBody(data);
      if (dataCheck.message == 'is empty') {
        return;
      }
      var io = data.io;
      var socket = data.socket;
      var room = data.room;
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
      let dataCheck = await passport.checkBody(data);
      if (dataCheck.message == 'is empty') {
        return;
      }
      let state = data.room;
      let io = data.io;
      let socket = data.socket;
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
      let dataCheck = await passport.checkBody(data);
      if (dataCheck.message == 'is empty') {
        return;
      }
      let socket = data.socket;
      let io = data.io;
      let room = data.room;
      socket.leave(room);
      io.to(room).emit('message', 'I leave');
    } catch (err) {
      console.error(err);
    }
  }

  async checkMessageNow(data) {
    try {
      let dataCheck = await passport.checkBody(data);
      if (dataCheck.message == 'is empty') {
        return;
      }
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
