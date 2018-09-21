const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Sockets')
  .then(() => {
    console.log('Successful connection');
  })
  .catch(err => {
    console.error('Can t connect to db');
  })

const User = mongoose.model('User', {
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  _id: {
    type: String,
  }
})

module.exports = {
  User: User
}