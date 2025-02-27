var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');
var FileStore = require('session-file-store')(session);
const url = config["mongo-url"];


const connect=mongoose.connect(url);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var leaderRouter = require('./routes/leaderRouter');
var promoRouter = require('./routes/promoRouter');
var uploadRouter = require('./routes/uploadRouter');
var favoriteRouter = require('./routes/favouriteRouter');
var app = express();

app.all('*',(req,res,next)=>{
  if(req.secure){
    next();
  }
  else
  {
    res.redirect(307,'https://'+req.hostname+':'+app.get('secPort')+req.url);
  }
})

connect.then((db)=>{
  console.log('Connected correctly to the server');
}).catch((err)=>{
  console.log(err);
})



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));
// app.use(session({
//   name:'session-id',
//   secret:'12345-67890-09876-54321',
//   saveUninitialized:false,
//   resave:false,
//   store:new FileStore()
// }))

app.use(passport.initialize());
// app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.statusCode = 401;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(res.statusCode);
  res.render('error');
});

module.exports = app;
