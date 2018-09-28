  var express = require('express');
var db = require('./db/db');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passportRouter = require('./routes/passport');
var indexRouter = require('./routes/index');
var app = express();

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var http = require('http').Server(app);
var io = require('socket.io')(http);

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

app.use('/', indexRouter);


module.exports = app;


