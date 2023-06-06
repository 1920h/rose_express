var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require('mongoose');
let cors = require('cors');

let corsOptions = {
  origin:"*",
  methods:['GET', 'POST'],
}

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let testRouter = require('./routes/test');
let subRouter = require('./routes/sub');
let infoRouter = require('./routes/info');
let edgeRouter = require("./routes/edge");

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/test',testRouter);
app.use('/api',subRouter)
app.use('/api',infoRouter)
app.use('/api',edgeRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log('err.message',err.message)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.connect("mongodb://hbw:383711651%40hbw@43.136.65.128:27016/rose?authSource=admin").then(res=>console.log('连接成功')).catch(err=>console.log('连接错误',err))


module.exports = app;
