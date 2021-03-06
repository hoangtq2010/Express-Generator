var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var FileStore = require('session-file-store')(session);

var passport = require('passport');
var authenticate = require('./authenticate');

var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var dishRouter = require('./routes/dishRouter');
var promotionRouter = require('./routes/promotionRouter');
var leaderRouter = require('./routes/leaderRouter');

const mongoose = require('mongoose');
const Dish = require('./models/dishes');

//const url = 'mongodb://localhost:27017/conFusion';
const url = config.mongoUrl;      //sử dụng file config như 1 nơi tập trung, chuẩn bị cấu hình cho ứng dụng
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Connected correctly to server');
}, (err) => { console.log(err); });


var app = express();

//Middleware chuyen huong tat ca truy cập đến tới cổng an toàn 
app.all('*', (req, res, next) => {
  if (req.secure){
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
    //vi du https://localhost:3443
    //307: tai nguyen nằm tạm thời dưới url khác 
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));
/*
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized:false,
  resave: false,
  store: new FileStore()
})) */

//app.use(passport.session());


/* Cookie
function auth(req, res, next){
  //console.log(req.headers); //req.headers: nếu thêm tiêu đề ủy quyền ta có thể nhìn thấy nó ngay tại đó
  //chỉ là xem những gì đang đến từ phía khác hàng
  //console.log(req.signedCookies)
  console.log(req.session)
  //if(!req.signedCookies){
  if(!req.session.user){
    //var authHeader = req.headers.authorization;
    //if(!authHeader){
    var err = new Error('You are not authenticated!');

      //res.setHeader('WWW-Authenticate','Basic');
    err.status = 403;
    return next(err);
  }
  else{
    //if(req.signedCookies.user === 'admin'){
    //if(req.session.user === 'admin'){
      if(req.session.user === 'authenticated'){
      next();
    }
    else{
      var err = new Error('You are not authenticated!');
      err.status = 403;
      return next(err);
    }
  } 
}
*/

//passport
/*
function auth (req, res, next) {
  console.log(req.user);

  if (!req.user) {
    var err = new Error('You are not authenticated!');
    err.status = 403;
    next(err);
  }
  else {
    next();
  }
}

app.use(auth);  //mac dinh client co the truy cap
*/
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/dishes', dishRouter);
app.use('/promotions', promotionRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
