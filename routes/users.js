var express = require('express');
var session = require('express-session');
const bodyParser = require('body-parser');
const Users = require('../Models/User');
var passport = require('passport');
var authenticate = require('../authenticate')
var router = express.Router();
router.use(bodyParser.json());
/* GET users listing. */


router.post('/signup',function(req,res,next){
  console.log(req.body);
  Users.register(new Users({username: req.body.username}),req.body.password,(err,user)=>{
    if(err)
    {
      res.statusCode = 500;
      res.setHeader('Content-Type','application/json');
      res.json({err:err});
    }
    else
    {
      if(req.body.firstname)
        user.firstname = req.body.firstname;
      if(req.body.lastname)
        user.lastname = req.body.lastname;
      console.log(req.body.lastname);
      user.save((err,user)=>{
        if(err)
        {
          res.statusCode = 500;
          res.setHeader('Content-Type','application/json');
          res.json({err:err});
        }
        else if(user)
        {
          passport.authenticate('local')(req,res,()=>{
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json({success:true,status:'Registration successful',user:user});
        });
        }
      });
    }
  });
})


router.get('/',authenticate.verifyAdmin,function(req,res,next){
  Users.find().
  then((result)=>{
  console.log("Listing Users");
  res.json(result);
  }).catch(Err=>{
    next(Err);
  })
});




router.post('/login',passport.authenticate('local'),(req,res)=>{
  console.log('Request is' +req.user._id)
  var token = authenticate.getToken({_id:req.user._id})
  console.log("Token is",token);
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({success:true,token:token,status:'You are successfully logged in'});

}); 


module.exports = router;
