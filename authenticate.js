var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./Models/User');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


exports.getToken = function(user){
   return jwt.sign(user,config["secret-key"],{expiresIn:3600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config["secret-key"];

exports.jwtPassport = passport.use('jwt-user',new JwtStrategy(opts,
    (jwt_payload,done)=>{
        console.log(jwt_payload);
        User.findOne({_id:jwt_payload._id},(err,user)=>{
            if(err){
                return done(err,false);
            }
            else if(user){
                return done(null,user);
            }
            else
            {
                return done(null,false);
            }
        })
    }
    ));
 exports.verifyUser = passport.authenticate('jwt-user',{session:false});

    exports.jwtPassportAdmin = passport.use('jwt-admin',new JwtStrategy(opts,
        (jwt_payload,done)=>{
            console.log(jwt_payload);
            User.findOne({_id:jwt_payload._id},(err,user)=>{
                if(err){
                    return done(err,false);
                }
                else if(user){
                    if(user.admin == true)
                    return done(null,user);

                    else
                    err = new Error("Only admin access is allowed");
                    return done(err,false);

                }
                else
                {
                    return done(null,false);
                }
            })
        }
        ));



exports.verifyAdmin = passport.authenticate('jwt-admin',{session:false});


