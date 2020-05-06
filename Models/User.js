const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');
const schema = mongoose.Schema;

var UserSchema = new schema({
    firstname:{
        type:String,
        default:''
    },
    lastname:{
        type:String,
        default:''
    },
    admin:{
        type:Boolean,
        default:false
    }
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Users',UserSchema);