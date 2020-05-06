const express = require('express');
const bodyParser = require('body-parser');
const promotions = require('../Models/promotions');
const promoRouter = express.Router();
const authenticate = require('../authenticate');
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req,res,next) => {
    console.log("Get called");
    promotions.find({}).then((result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }).catch((err)=>{
        res.json("There is an error "+ err);
        console.log(err);
    })
})
.post(authenticate.verifyAdmin,(req, res, next) => {
    console.log("Post called");
    promotions.create(req.body).then((result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }).catch((err)=>{
        res.json("There is an error "+ err);
        console.log(err);
    })
})
.put(authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyAdmin,(req, res, next) => {
    console.log("Delete called");
    promotions.remove().then((result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }).catch((err)=>{
        res.json("There is an error "+ err);
        console.log(err);
    })
});

promoRouter.route('/:promoid')
.get((req,res,next) => {
    console.log("Get called");
    promotions.findById(req.params.promoid).then((result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }).catch((err)=>{
        res.json("There is an error "+ err);
        console.log(err);
    })
})
.post(authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('Post is not a supported operation');
})
.put(authenticate.verifyAdmin,(req, res, next) => {
    console.log("Put called");
    promotions.findByIdAndUpdate(req.params.promoid,{$set:req.body},{new:true}).then((result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }).catch((err)=>{
        res.json("There is an error "+ err);
        console.log(err);
    })
})
.delete(authenticate.verifyAdmin,(req, res, next) => {
    console.log("Delete called");
    promotions.findByIdAndDelete(req.params.promoid).then((result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }).catch((err)=>{
        res.json("There is an error "+ err);
        console.log(err);
    })
});



module.exports = promoRouter;