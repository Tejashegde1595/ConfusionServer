const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favourites = require('../Models/favourites')
const favouritesRouter = express.Router();
const authenticate = require('../authenticate');



favouritesRouter.route('/').get(authenticate.verifyUser,(req,res,next)=>{
    Favourites.find({UserId:req.user._id}).populate('dishid').then((favourites)=>{
        if(favourites)
        {
            res.statusCode = 200;
            res.setHeader('conent-type','text/html');
            res.json(favourites);
        }
        else
        {
            err = new Error("No favourites exist");
            next(err);
        }
    }).catch(err=>{
        console.log(err);
        next(err);
    });
}).post(authenticate.verifyUser,(req,res,next)=>{
var docs = {UserId:req.user._id};
   Favourites.find(docs).populate('UserId').then((favourites)=>{
   console.log(favourites);
   if(favourites.length<1)
   {
    var Userdocs = {UserId:req.user._id,dishid:req.body.dishid};
    Favourites.create(Userdocs).then(favourite=>{
    if(favourite)
    {
        res.statusCode = 200;
        res.setHeader('conent-type','text/html');
        res.json(favourite);
    }
    else
    {
        err = new Error("No favourites exist");
        next(err);
    }
    }).catch(err=>{
    console.log(err);
    next(err);
    });
   }   
   else
   {
    for(i=0;i<=req.body.length;i++)
    {
        console.log("Dish id Old is");
        console.log("Dish Id is ",favourites[0].dishid);
        favourites[0].dishid.push(req.body[i].dishid);
        favourites[0].save().then((favourites)=>{
        res.statusCode = 200;
        res.setHeader('conent-type','text/html');
        res.json(favourites);
        }).catch(err=>{
        console.log(err);
        })
    }   
    
    }
});

}).delete(authenticate.verifyUser,(req,res,next)=>{
    Favourites.deleteMany({UserId:req.user._id}).then((favourites)=>{
        if(favourites)
        {
            res.statusCode = 200;
            res.setHeader('conent-type','text/html');
            res.json(favourites);
        }
        else
        {
            err = new Error("No favourites exist");
            next(err);
        }
    }).catch(err=>{
        console.log(err);
        next(err);
    });
}).put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 400;
    res.json("Put is not a supported operation");
})


favouritesRouter.route('/:dishid').get(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 400;
    res.json("Put is not a supported operation");
}).post(authenticate.verifyUser,(req,res,next)=>{
    var docs = {UserId:req.user._id};
   Favourites.find(docs).then((favourites)=>{
   console.log(favourites);
   if(favourites.length>0)
   {
        favourites.dishid.push(req.body);
        favourites.save().then((favourites)=>{
        res.statusCode = 200;
        res.setHeader('conent-type','text/html');
        res.json(favourite);
        }).catch(err=>{
        console.log(err);
        });
   }
   else
   {
        var Userdocs = {UserId:req.user._id,dishid:req.body.dishid};
        Favourites.create(Userdocs).then(favourite=>{
        if(favourite)
        {
            res.statusCode = 200;
            res.setHeader('conent-type','text/html');
            res.json(favourite);
        }
        else
        {
            err = new Error("No favourites exist");
            next(err);
        }
        }).catch(err=>{
        console.log(err);
        next(err);
        });
    }
});
}).delete(authenticate.verifyUser,(req,res,next)=>{
    Favourites.deleteMany({UserId:req.user._id,dishid:req.params.dishid}).then((favourites)=>{

    for(i=0;i<favourites.dishid.length;i++)
    {
        if(favourites.dishid[i].toString()=== req.params.dishid)
        {
            favourites.dishid[i].remove();
            favourites.save().then(favorites=>{
            res.json(favourites);
            })
        }
    }

    })
})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode = 400;
    res.json("Put is not a supported operation");
})


module.exports = favouritesRouter;