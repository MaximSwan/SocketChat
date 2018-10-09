var db = require('../db/db');

let creatRoom = async data => {
  try {
    let room = new db.Room();
    room.name = data;
    room.validate();
    await room.save();
    return room;
  } catch (err) {
    console.log(err);
  }
}

module.exports.creatRoom = creatRoom;