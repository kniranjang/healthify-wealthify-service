var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user_Details');
var hospitalsRouter = require('./routes/hospitals');
var bulkRouters = require('./routes/bulkRouters');
var cors = require('cors');
require('./clients/notifications');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/hospitals', hospitalsRouter);
app.use('/bulk', bulkRouters);

module.exports = app;
