//tep users.js dc mo rong de tao bo dinh tuyen
var express = require('express');

const bodyParser = require('body-parser');
var User = require('../models/user');
const { route } = require('.');

var router = express.Router();

var passport = require('passport');

var authenticate = require('../authenticate');

router.use(bodyParser.json());
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//Điểm cuối đăng ký cho phép đăng ký
/*
router.post('/signup', (req, res, next) => {
  User.findOne({username: req.body.username})     //check user
  .then((user) => {
    if(user != null){           //ko tồn tại
      var err = new Error('User ' + req.body.username + ' already exists!');
      err.status = 403; //cam
      next(err);
    }
    else{                       //tạo
      return User.create({
        username: req.body.username,
        password: req.body.password })
    }
  })
  .then((user) => {             //thông báo nếu dc tạo
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json({status: 'Registration Successful! ', user: user});
  }, (err) => next(err))
  .catch((err) => next(err));
});
*/
router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}),
    req.body.password, (err, user) => {
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type','application/json');
        res.json({err: err});
      }
      else{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({status: 'Registration Successful! ', user: user});
      }
    }
  )
})

//Cho phép đăng nhập
/*router.post('/login', (req, res, next) =>{
  if(!req.session.user){          //kiểm tra session chưa tồn tại
    var authHeader = req.headers.authorization;
    if(!authHeader){
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate','Basic');
      err.status = 401;
      return next(err);
    }
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');     //mã hóa mật khẩu
    var username = auth[0];
    var password = auth[1];

    User.findOne({username: username})        
    .then((user) => {                 
      if(user == null){       //nếu user ko có
        var err = new Error('User ' + username + ' does not exist!');
        err.status = 403;
        return next(err);
      }
      else if(user.password !== password){    // check pass false
        var err = new Error('Your password is incorrect!');
        err.status = 403;
        return next(err);
      }
      else if(user.username === username && user.password === password){      //true
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        res.send('You are authenticated!');
      }
    })
    .catch((err) => next(err));
  }
  else{                         //Nếu đã đăng nhập trước rồi(ko phải xác minh)
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end('You are already authenticated!');
  }
});
*/

/*router.post('/login', passport.authenticate('local'), (req, res) => {   //de xac thuc passport: passport.authenticate('local')
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({success: true ,status: 'You are successfully logged in! '});
})
*/

//Phát hành mã thông báo(token)cho khách hàng sau khi đăng nhập
router.post('/login', passport.authenticate('local'), (req, res) => {

  var token = authenticate.getToken({_id: req.user._id});   //tham số user sử dụng làm 1 payload khi tạo jwt trong dòng 16(authenticate.js)
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});


router.get('/logout', (req, res, next) => {
  if(req.session){                  // check login session
    req.session.destroy();          //pha huy session
    res.clearCookie('session-id');   //xoa cookie may khach
    res.redirect('/');                //chuyen huong 
  }
  else{
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
