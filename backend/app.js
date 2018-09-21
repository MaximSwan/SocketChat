  var express = require('express');
var db = require('./db/db');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passportRouter = require('./routes/passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  next();
});

app.use((err, req, res, next) => {
  console.error(err);
  
  if (err && err.name && err.name === 'ValidationError') {  
    let errorData = { statusCode: 400, message: '' };
    let validationKey = Object.keys(err.errors);
    validationKey.forEach(key => {
      errorData.message = errorData.message.concat(err.errors[key].message) + ' '
    });
    res.status(errorData.statusCode).send(errorData);
  }
  
  let errorData = {
    statusCode: err && err.statusCode < 500 && err.statusCode || 500,
    message: err && err.statusCode < 500 && err.message || 'Internal server error'
  };

  res.status(errorData.statusCode).send(errorData);
});

app.use('/', passportRouter);
app.use('/', indexRouter);
app.use('/', usersRouter);


module.exports = app;


