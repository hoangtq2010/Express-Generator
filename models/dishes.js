const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);    //tai loai tien te moi nay vao moongoose
const Currency = mongoose.Types.Currency;   //loai Currency them vao mongoose, xac dinh luoc do trong ung dung

const commentSchema = new Schema({
    rating : {
        type : Number,
        min : 1,
        max : 5,
        required : true
    },
    comment : {
        type : String, 
        required : true
    },
    author : {
        type : String,
        required : true
    }
},{
    timestamps : true
})



const dishSchema = new Schema({
    name : {
        type : String,
        required : true,      //moi document se co name nhu 1 truong bat buoc
        unique : true        //duy nhat, ko co 2 document trung ten
    },
    description : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    label : {
        type : String,
        default : ''      //gia tri mac dinh
    },
    price : {
        type : Currency,
        required : true,
        min : 0
    },
    featured : {
        type : Boolean,
        default : false
    },
    comments : [ commentSchema ]    
},{
    timestamps : true          //tu dong chen time vao model(abtomat update)
});

var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;
