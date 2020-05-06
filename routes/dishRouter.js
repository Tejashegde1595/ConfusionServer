const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes = require('../Models/dishes')
const dishRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    Dishes.find({})
    .populate('comments.author')
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Conent-Type','application/json');
        res.json(dishes);
    }).catch((err)=>{
        console.log(err);
    })
})
.post(cors.corsWithOptions,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.create(req.body).then((dish)=>{
        console.log('Dish Created',dish);
        res.statusCode=200;
        res.setHeader('Conent-Type','application/json');
        res.json(dish);
    }).catch((err)=>{
        console.log(err);
    })
})
.put(cors.corsWithOptions,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(cors.corsWithOptions,authenticate.verifyAdmin,(req, res, next) => {
   Dishes.remove({}).then((dish)=>{
    res.statusCode=200;
    res.setHeader('Conent-Type','application/json');
    res.json(dish);
   }).catch((err)=>{
    console.log(err);
})
});

dishRouter.route('/:dishid')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get((req,res,next) => {
    Dishes.findById(req.params.dishid)
    .populate('comments.author')
    .then((dishes)=>{
        res.statusCode=200;
        res.setHeader('Conent-Type','application/json');
        res.json(dishes);
    },((err)=>{
        res.json(err);
    })
    ).catch((err)=>{
        console.log(err);
    })
})
.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('Post is not a supported operation');
})
.put(authenticate.verifyAdmin,(req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishid,{
        $set:req.body
    },{new:true}).then((dish)=>{
        console.log('Dish Created',dish);
        res.statusCode=200;
        res.setHeader('Conent-Type','application/json');
        res.json(dish);
    }).catch((err)=>{
        console.log(err);
    })
})
.delete(authenticate.verifyAdmin,(req, res, next) => {
    Dishes.findByIdAndDelete(req.params.dishid).then((dish)=>{
        res.statusCode=200;
        res.setHeader('Conent-Type','application/json');
        res.json(dish);
       }).catch((err)=>{
        console.log(err);
    })
});



dishRouter.route('/:dishid/comments/:commentId')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishid)
    .populate('comments.author')
    .then((dishes)=>{
        if(dishes!=null && dishes.comments.id(req.params.commentId)!=null)
        {
        res.statusCode=200;
        res.setHeader('Conent-Type','application/json');
        res.json(dishes.comments.id(req.params.commentId));
        }
        else if(dishes ==null)
        {
            err=new Error("Dish"+req.params.dishid+'not found');
            res.statusCode=404;
            return next(err);
        }
        else
        {
            err=new Error("Dish"+req.params.commentId+'not found');
            res.statusCode=404;
            return next(err);
        }
    },((err)=>{
        res.json(err);
    })
    ).catch((err)=>{
        console.log(err);
    })
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('Post operation not supported on /dishes/comments/:commentId');
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishid).then((dishes)=>{
        if(dishes!=null && dishes.comments.id(req.params.commentId)!=null)
        {   
        
            if(dishes.comments.id(req.params.commentId).author.toString() == req.user._id.toString())
            {
    
            if(req.body.rating){
            
                dishes.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if(req.body.comment){
                dishes.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dishes.save().then((dish)=>{
                Dishes.findById(dish._id).populate('comments.author')
                .then(dish=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
                })
               
            })

            }
            else
            {
                err=new Error("You do not have permissions to edit this comment");
                res.statusCode=404;
                return next(err);
            }

     
        }
        else if(dishes ==null)
        {
            err=new Error("Dish"+req.params.dishid+'not found');
            res.statusCode=404;
            return next(err);
        }
        else
        {
            err=new Error("Dish"+req.params.commentId+'not found');
            res.statusCode=404;
            return next(err);
        }
    },((err)=>{
        res.json(err);
    })
    ).catch((err)=>{
        console.log(err);
    })
})
.delete(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishid)
    .populate('comments.author')
    .then((dishes)=>{
        if(dishes!=null && dishes.comments.id(req.params.commentId)!=null)
        {
            if(dishes.comments.id(req.params.commentId).author.toString() == req.user._id.toString())
            {
            dishes.comments.id(req.params.commentId).remove();
            dishes.save().then((dish)=>{
                dishes.findById(dish._id).populate('comments.author')
                .then(dish=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish);
                })
            })  
            }
            else
            {
                err=new Error("You do not have permissions to edit this comment");
                res.statusCode=404;
                return next(err);
            }
        }
        else if(dishes ==null)
        {
            err=new Error("Dish"+req.params.dishid+'not found');
            res.statusCode=404;
            return next(err);
        }
        else
        {
            err=new Error("Dish"+req.params.commentId+'not found');
            res.statusCode=404;
            return next(err);
        }
    })
});


dishRouter.route('/:dishid/comments')
.options(cors.corsWithOptions,(req,res)=>{
    res.sendStatus(200);
})
.get(cors.cors,(req,res,next) => {
    Dishes.findById(req.params.dishid)
    .populate('comments.author')
    .then((dishes)=>{
        if(dishes!=null)
        {
        res.statusCode=200;
        res.setHeader('Conent-Type','application/json');
        res.json(dishes.comments);
        }
        else
        {
            err=new Error("Dish"+req.params.dishid+'not found');
            res.statusCode=404;
            return next(err);
        }
    },((err)=>{
        res.json(err);
    })
    ).catch((err)=>{
        console.log(err);
    })
})
.post(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishid).then((dishes)=>{
        if(dishes!=null)
        {
        req.body.author = req.user._id;
        dishes.comments.push(req.body);
        dishes.save().then((dish)=>{
            console.log("Author is "+dish.comments.author);
            Dishes.findById(dish._id).populate('comments.author').
            then((dish)=>{
                res.statusCode=200;
                res.setHeader('Conent-Type','application/json');
                res.json(dish);
            });
        });   
        }
        else
        {
            err=new Error("Dish"+req.params.dishid+'not found');
            res.statusCode=404;
            return next(err);
        }
    })
})
.put(cors.corsWithOptions,authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(cors.corsWithOptions,authenticate.verifyAdmin,(req, res, next) => {
    Dishes.findById(req.params.dishid).then((dishes)=>{
        if(dishes!=null)
        {
         
            for(var i=(dishes.comments.length-1);i>=0;i--)
            {
                dishes.comments.id(dishes.comments[i]._id).remove();
            
            }
            dishes.save().then((dish)=>{
                res.statusCode=200;
                res.setHeader('Conent-Type','application/json');
                res.json(dishes);
            })  
        }
        else
        {
            err=new Error("Dish"+req.params.dishid+'not found');
            res.statusCode=404;
            return next(err);
        }
    })
});


module.exports = dishRouter;