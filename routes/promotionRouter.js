const express = require('express');
const bodyParser = require('body-parser');

const promotionRouter = express.Router();  

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')   //tuyen bo diem cuoi tai 1 vi tri duy nhat
.all( (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    next();
})
.get( (req, res, next) =>{
    res.end('Will send all the promotions to you!');
})
.post( (req, res, next) =>{
    res.end('Will add the promotions: ' + req.body.name + ' with details: ' + req.body.description);
})
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete( (req, res, next) =>{
    res.end('Deleting all the promotions!');
});

promotionRouter.route('/:promotionId')   //tuyen bo diem cuoi tai 1 vi tri duy nhat
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html');
    next();
})
.get( (req, res, next) =>{
    res.end('Will send details of the promotions: ' + req.params.dishId + ' to you!');
})
.post( (req, res, next) =>{
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions' + req.params.dishId);
})
.put((req, res, next) => {
    res.write('Updating the promotion: ' + req.params.dishId + '\n');
    res.end('Will update the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})
.delete((req, res, next) =>{
    res.end('Deleting promotion: ' + req.params.dishId);
});


module.exports = promotionRouter;