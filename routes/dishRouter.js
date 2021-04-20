const express = require('express');
const bodyParser = require('body-parser');  //phân tích cú pháp vật thể
const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();  //tuyen bo dishRouter la 1 bo dinh tuyen Express

dishRouter.use(bodyParser.json());

dishRouter.route('/')   //tuyen bo diem cuoi tai 1 vi tri duy nhat
/*.all( (req, res, next) => {       //.all : diem cuoi giong nhau
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    next();
})*/
.get( (req, res, next) =>{
    //res.end('Will send all the dishes to you!');
    //Mong tra lai tat ca mon an
    
    Dishes.find({})     //Tu may chu Express truy cap vao MongoDB
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);   //lay tham so ma ban cung cap va gui json tro lai
        //Dua dishes vao body cua tin nhan tra loi va gui lai may chu

    }, (err) => next(err)) //nếu 1 lỗi đc trả lại,sau đó chỉ đơn giản là vượt qua lỗi để xử lí lỗi tổng thể
    .catch((err) => next(err));
})
.post( (req, res, next) =>{
    //res.end('Will add the dishes: ' + req.body.name + ' with details: ' + req.body.description);
    
    Dishes.create(req.body)     //body-parser sẽ phân tich bất cứ điều gì vào thuộc tính body trong request
    .then((dish) => {
        console.log('Dish created: ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete( (req, res, next) =>{
    //res.end('Deleting all the dishes!');

    Dishes.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});



//Trả lại giá trị món ăn đó
dishRouter.route('/:dishId')   //tuyen bo diem cuoi tai 1 vi tri duy nhat
/*.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    next();
})*/
.get( (req, res, next) =>{
    //res.end('Will send details of the dishes: ' + req.params.dishId + ' to you!');

    Dishes.findById(req.params.dishId)  //id món ăn có trong thuộc tính params
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post( (req, res, next) =>{
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes' + req.params.dishId);
})
.put((req, res, next) => {
    /*res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description);*/

    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body          //thiết lập
    }, {
        new : true              //cập nhật
    })
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) =>{
    //res.end('Deleting dish: ' + req.params.dishId);

    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = dishRouter;