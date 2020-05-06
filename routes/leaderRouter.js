const express = require('express');
const bodyParser = require('body-parser');
const leaders = require('../Models/leaders');
const leaderRouter = express.Router();
const authenticate = require('../authenticate');
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next) => {
    console.log("Get called");
    leaders.find({}).then((result)=>{
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
    leaders.create(req.body).then((result)=>{
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
    leaders.remove().then((result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }).catch((err)=>{
        res.json("There is an error "+ err);
        console.log(err);
    })
});

leaderRouter.route('/:leaderid')
.get((req,res,next) => {
    console.log("Get called");
    leaders.findById(req.params.leaderid).then((result)=>{
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
    leaders.findByIdAndUpdate(req.params.leaderid,{$set:req.body},{new:true}).then((result)=>{
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
    leaders.findByIdAndDelete(req.params.leaderid).then((result)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }).catch((err)=>{
        res.json("There is an error "+ err);
        console.log(err);
    })
});



module.exports = leaderRouter;