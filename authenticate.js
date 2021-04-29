var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');

var JwtStrategy = require('passport-jwt').Strategy;       //Điều này cung cấp 1 Strategy dựa trên jwt để cấu hình module passport
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');      //sử dụng tạo,ký(sign), xác minh(verify) tokens
var config = require('./config.js');

passport.use(new LocalStrategy(User.authenticate())); //Su dung method xac thuc static cua model trong LocalStrategy
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//1 vài chức năng bổ sung mà ta xuất để tạo mã thông báo(token)
exports.getToken = function(user){      //tham so chi don gian goi la user, la Object json
    return jwt.sign(user, config.secretKey, 
        {expiresIn: 3600});      //expiresIn: cho biết jwt tồn tại bao lâu(3600s)
};

//Cấu hình Strategy(chiến lược) dựa trên jwt cho ứng dụng passport
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //jwtFromRequest: xác định cách jwt nên dc trích xuất từ tin nhắn yêu cầu đến
//fromAuthHeaderAsBearerToken: đây là cách cơ bản trong nhiều cách khác nhau để trích xuất jwt

opts.secretOrKey = config.secretKey;   //tham số thứ 2 cung cấp secretKey sử dụng trong Strategy cho đăng nhập

//Cấu hình Strategy passport jwt: passport.use(....)
exports.jwtPassport = passport.use(new JwtStrategy(opts,    //sử dụng JwtStrategy giống dòng 10 
    function(jwt_payload, done) {
        /*function(jwt_payload, done): gọi lại dc cung cấp bởi passport
        Vì vậy bất cứ khi nào bạn có passport mà đang cấu hình với 1 Strategy mới, cần cung cấp tham số "done"
        Thông qua tham số "done" này bạn sẽ chuyển thông tin lại cho passport,
        mà sau đó nó sẽ sử dụng để tải mọi thứ vào request message */
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) =>{    //giá trị id nằm trong payload của jwt
            if(err){
                return done(err,false); //ko đi qua giá trị user , chỉ đi qua err
            }
            else if(user){
                return done(null, user);
            }
            else{
                return done(null, false); //ko tìm thấy user , đi qua false
            }
        });
    })) 
    
exports.verifyUser = passport.authenticate('jwt', {session: false});  //Đang xác thực dựa trên token, ko phải session

/**Để xác minh 1 người dùng(verifyUser) ta sử dụng Jwt Strategy, cách hoạt động Jwt Strategy:
 * Trong yêu cầu đến, mã token sẽ đc bao gồm trong tiêu đề xác thực(header authentication- dòng 23)
 * nếu nó đc bao gồm, sau đó nó sẽ dc trích xuất(Extract) và sử dụng để xác thực người dùng dựa trên token
*/