//Tao ra luoc do nguoi dung va mo hinh
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    /*username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },*/
    firstname: {
        type: String,
          default: ''
      },
      lastname: {
        type: String,
          default: ''
      },

    admin: {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose); //su dung passport-local-mongoose tu dong update schema username,password

module.exports = mongoose.model('User', User);