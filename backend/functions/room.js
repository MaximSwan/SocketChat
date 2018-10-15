var db = require('../db/db');
var passport = require('../functions/passport');

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

module.exports.creatRoom = creatRoom;
module.exports.getRooms = getRooms;
module.exports.deleteRoom = deleteRoom;
